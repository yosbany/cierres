export const MANAGER_API_CONFIG = {
  baseUrl: 'https://nuevariodor.af-south-1.manager.io/api2',
  token: 'ChhURUpBUyBERSBMQSBDUlVaIFlPU0JBTlkSEgnzvf+i5UKnQhGGybTFLzlWtxoSCemnLsvMSBRPEbfTgXo9pLrP',
  endpoints: {
    purchaseInvoices: '/purchase-invoices',
    purchaseOrders: '/purchase-orders'
  },
  headers: {
    'X-API-KEY': 'ChhURUpBUyBERSBMQSBDUlVaIFlPU0JBTlkSEgnzvf+i5UKnQhGGybTFLzlWtxoSCemnLsvMSBRPEbfTgXo9pLrP',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  requestTimeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000
} as const;