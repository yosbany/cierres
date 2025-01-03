import { MANAGER_API_CONFIG } from '../../config/managerApi';

export interface ManagerPayment {
  key: string;
  date: string;
  paidFrom: string;
  description: string | null;
  payee: string;
  amount: {
    value: number;
    currency: string | null;
  };
  image: string | null;
  attachment: boolean;
  edit: string | null;
  view: string | null;
}

class ManagerPaymentsService {
  private static instance: ManagerPaymentsService;
  private retryCount = 0;
  private readonly maxRetries = MANAGER_API_CONFIG.retryAttempts;

  private constructor() {}

  public static getInstance(): ManagerPaymentsService {
    if (!ManagerPaymentsService.instance) {
      ManagerPaymentsService.instance = new ManagerPaymentsService();
    }
    return ManagerPaymentsService.instance;
  }

  private async fetchWithRetry(url: string, options: RequestInit): Promise<Response> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...MANAGER_API_CONFIG.headers,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        await new Promise(resolve => 
          setTimeout(resolve, MANAGER_API_CONFIG.retryDelay * this.retryCount)
        );
        return this.fetchWithRetry(url, options);
      }

      throw error;
    }
  }

  public async fetchDailyPayments(date: string): Promise<ManagerPayment[]> {
    try {
      const url = new URL(`${MANAGER_API_CONFIG.baseUrl}/payments`);
      url.searchParams.append('date', date);
      
      const response = await this.fetchWithRetry(url.toString(), {
        method: 'GET',
        signal: AbortSignal.timeout(MANAGER_API_CONFIG.requestTimeout)
      });

      const data = await response.json();
      if (data && Array.isArray(data.payments)) {
        return data.payments;
      }
      return [];
    } catch (error) {
      console.error('Error fetching Manager.io payments:', error);
      return [];
    }
  }
}

export const managerPayments = ManagerPaymentsService.getInstance();