import { Transaction } from '../types';
import { TRANSACTION_STATES, DEFAULT_CONCEPTS } from '../constants';

export function getPendingTransactions(transactions: Transaction[] = []): Transaction[] {
  if (!transactions || !Array.isArray(transactions)) {
    return [];
  }

  return transactions.filter(transaction => {
    // Skip transfers as they are always completed
    if (transaction.paymentType === 'transferencia') {
      return false;
    }

    // Find the concept definition
    const concept = Object.values(DEFAULT_CONCEPTS).find(c => c.name === transaction.concept);
    if (!concept) return false;

    // Find current state in concept's states
    const currentState = concept.states.find(s => s.name === transaction.status);
    if (!currentState) return false;

    // Check if there are more states after the current one
    const currentStateIndex = concept.states.indexOf(currentState);
    return currentStateIndex < concept.states.length - 1;
  });
}

export function getNextState(transaction: Transaction): string | null {
  // Skip transfers
  if (transaction.paymentType === 'transferencia') return null;

  // Find the concept definition
  const concept = Object.values(DEFAULT_CONCEPTS).find(c => c.name === transaction.concept);
  if (!concept) return null;

  // Find current state in concept's states
  const currentState = concept.states.find(s => s.name === transaction.status);
  if (!currentState) return null;

  // Get next state
  const currentStateIndex = concept.states.indexOf(currentState);
  const nextState = concept.states[currentStateIndex + 1];
  
  return nextState ? nextState.name : null;
}

export function getTransactionStateInfo(status: string) {
  return Object.values(TRANSACTION_STATES).find(s => s.name === status) || null;
}