import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { DailyClosure, Account, Transaction } from '../types';
import { formatDate, formatDateTime } from './dateUtils';
import { formatCurrency } from './formatters';

interface GeneratePDFParams {
  closure: DailyClosure;
  accounts: Account[];
  transactions: Transaction[];
  observations: string;
}

export function generateClosurePDF({
  closure,
  accounts,
  transactions,
  observations
}: GeneratePDFParams) {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text('Cierre Diario', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text(formatDate(closure.date), 105, 30, { align: 'center' });

  // Accounts Summary
  doc.setFontSize(16);
  doc.text('Resumen de Cuentas', 14, 45);
  
  const accountsData = accounts.map(account => [
    account.name,
    formatCurrency(account.initialBalance),
    formatCurrency(account.currentBalance)
  ]);

  (doc as any).autoTable({
    startY: 50,
    head: [['Cuenta', 'Saldo Inicial', 'Saldo Actual']],
    body: accountsData,
    theme: 'grid'
  });

  // Transactions
  doc.setFontSize(16);
  doc.text('Movimientos', 14, (doc as any).lastAutoTable.finalY + 15);

  const transactionsData = transactions.map(transaction => [
    formatDateTime(transaction.timestamp),
    transaction.concept,
    transaction.description,
    accounts.find(a => a.id === transaction.accountId)?.name,
    formatCurrency(transaction.amount),
    transaction.status
  ]);

  (doc as any).autoTable({
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [['Fecha', 'Concepto', 'Descripción', 'Cuenta', 'Monto', 'Estado']],
    body: transactionsData,
    theme: 'grid'
  });

  // Calculate totals
  const { cashTotal, bankTotal } = accounts.reduce(
    (acc, account) => {
      if (account.type === 'efectivo') {
        acc.cashTotal += account.currentBalance;
      } else if (account.type === 'banco') {
        acc.bankTotal += account.currentBalance;
      }
      return acc;
    },
    { cashTotal: 0, bankTotal: 0 }
  );

  // Totals Summary
  let currentY = (doc as any).lastAutoTable.finalY + 20;

  doc.setFontSize(14);
  doc.text(`Total Efectivo: ${formatCurrency(cashTotal)}`, 14, currentY);
  currentY += 8;
  doc.text(`Total Banco: ${formatCurrency(bankTotal)}`, 14, currentY);
  currentY += 8;
  doc.text(`Saldo Final: ${formatCurrency(closure.finalBalance)}`, 14, currentY);

  // Observations
  if (observations) {
    currentY += 20;
    doc.setFontSize(16);
    doc.text('Observaciones', 14, currentY);
    currentY += 10;
    
    const splitObservations = doc.splitTextToSize(observations, 180);
    doc.setFontSize(12);
    doc.text(splitObservations, 14, currentY);
    currentY += (splitObservations.length * 7) + 20;
  } else {
    currentY += 40;
  }

  // Signature space
  doc.line(14, currentY, 100, currentY); // Signature line
  doc.setFontSize(12);
  doc.text('Firma del Responsable', 14, currentY + 5);

  return doc;
}