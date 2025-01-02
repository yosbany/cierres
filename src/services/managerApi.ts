import { format } from 'date-fns';

const API_BASE_URL = 'https://nuevariodor.af-south-1.manager.io/api2';
const API_TOKEN = 'ChhURUpBUyBERSBMQSBDUlVaIFlPU0JBTlkSEgnzvf+i5UKnQhGGybTFLzlWtxoSCemnLsvMSBRPEbfTgXo9pLrP';

interface ManagerInvoice {
  Date: string;
  Amount: number;
  Reference: string;
  Description: string;
}

export async function fetchDailyInvoices(date: string): Promise<ManagerInvoice[]> {
  try {
    const formattedDate = format(new Date(date), 'yyyy-MM-dd');
    const response = await fetch(`${API_BASE_URL}/PurchaseInvoices?Date=${formattedDate}`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'GET'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid API response format');
    }

    return data;
  } catch (error) {
    console.error('Error fetching Manager.io invoices:', error);
    // Return empty array instead of throwing to prevent UI disruption
    return [];
  }
}