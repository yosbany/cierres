export interface Account {
  id: string;
  name: string;
  type: 'efectivo' | 'banco';
  initialBalance: number;
  currentBalance: number;
}

export interface ConceptState {
  id: string;
  name: string;
  order: number;
  isFinal: boolean;
}

export interface Transaction {
  id: string;
  concept: string;
  description: string;
  amount: number;
  status: string;
  timestamp: number;
  accountId: string;
  transferId?: string;
  relatedAccountId?: string;
  paymentType: 'efectivo' | 'banco' | 'transferencia';
}

export interface DailyClosure {
  id: string;
  date: string;
  status: 'open' | 'closed';
  accounts: Account[];
  transactions: Transaction[];
  observations: string;
  userId: string;
  finalBalance: number;
  createdAt: number;
  updatedAt: number;
}

export interface PredefinedAccount {
  id: string;
  name: string;
  type: 'efectivo' | 'banco';
}

export interface PredefinedConcept {
  id: string;
  name: string;
  type: 'ingreso' | 'egreso';
  states: ConceptState[];
}