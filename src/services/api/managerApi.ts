import { format } from 'date-fns';
import { MANAGER_API_CONFIG } from '../../config/managerApi';

export interface ManagerPurchaseOrder {
  id: string;
  date: string;
  amount: number;
  reference: string;
  description: string;
  supplier?: {
    name: string;
    id: string;
  };
  status: 'pending' | 'approved' | 'completed';
}

class ManagerApiError extends Error {
  constructor(
    message: string, 
    public status?: number, 
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ManagerApiError';
  }
}

export class ManagerApiService {
  private static instance: ManagerApiService;
  private retryCount = 0;
  private readonly maxRetries = MANAGER_API_CONFIG.retryAttempts;

  private constructor() {}

  public static getInstance(): ManagerApiService {
    if (!ManagerApiService.instance) {
      ManagerApiService.instance = new ManagerApiService();
    }
    return ManagerApiService.instance;
  }

  private async fetchWithRetry(url: string, options: RequestInit): Promise<Response> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...MANAGER_API_CONFIG.headers,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        throw new ManagerApiError(
          'Error en la conexión con Manager.io',
          response.status,
          response.status === 401 ? 'AUTH_ERROR' : 'API_ERROR'
        );
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

      this.retryCount = 0;
      throw new ManagerApiError(
        'Error de conexión con Manager.io',
        undefined,
        'NETWORK_ERROR',
        error
      );
    }
  }

  public async fetchDailyPurchaseOrders(date: string): Promise<ManagerPurchaseOrder[]> {
    try {
      const formattedDate = format(new Date(date), 'yyyy-MM-dd');
      const endpoint = `${MANAGER_API_CONFIG.baseUrl}${MANAGER_API_CONFIG.endpoints.purchaseOrders}`;
      const url = new URL(endpoint);
      url.searchParams.append('date', formattedDate);
      url.searchParams.append('fields', 'id,date,amount,reference,description,supplier,status');

      const response = await this.fetchWithRetry(url.toString(), {
        method: 'GET',
        signal: AbortSignal.timeout(MANAGER_API_CONFIG.requestTimeout)
      });

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        console.warn('Invalid API response format:', data);
        return [];
      }

      return data.map(order => ({
        ...order,
        amount: Number(order.amount),
        date: format(new Date(order.date), 'yyyy-MM-dd')
      }));
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      return []; // Return empty array instead of throwing
    }
  }
}

export const managerApi = ManagerApiService.getInstance();