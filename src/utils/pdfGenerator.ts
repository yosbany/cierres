import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { DailyClosure, Account, Transaction } from '../types';
import { formatDate, formatDateTime } from './dateUtils';
import { calculateAccountTotals } from './accountCalculations';

interface GeneratePDFParams {
  closure: DailyClosure;
  accounts: Account[];
  transactions: Transaction[];
  observations: string;
}

// Table width constants
const TABLE_WIDTH = 180;
const LEFT_MARGIN = 14;
const RIGHT_MARGIN = 14;

function formatAmount(amount: number): string {
  return amount.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function addHeader(doc: jsPDF, closure: DailyClosure) {
  doc.setFontSize(16);
  doc.text('Cierre Diario', 105, 15, { align: 'center' });
  doc.setFontSize(10);
  doc.text(formatDate(closure.date), 105, 22, { align: 'center' });
}

function addAccountsSummary(doc: jsPDF, accounts: Account[]) {
  doc.setFontSize(12);
  doc.text('Resumen de Cuentas', LEFT_MARGIN, 32);
  
  const accountsData = accounts.map(account => [
    account.name,
    formatAmount(account.initialBalance),
    formatAmount(account.currentBalance),
    formatAmount(account.currentBalance - account.initialBalance)
  ]);

  (doc as any).autoTable({
    startY: 35,
    head: [['Cuenta', { content: '$ Saldo Inicial', styles: { halign: 'right' } }, { content: '$ Saldo Actual', styles: { halign: 'right' } }, { content: '$ Diferencia', styles: { halign: 'right' } }]],
    body: accountsData,
    theme: 'grid',
    headStyles: {
      fillColor: [80, 80, 80],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      cellPadding: 1.5,
      fontSize: 8
    },
    columnStyles: {
      0: { cellWidth: TABLE_WIDTH * 0.35 },
      1: { cellWidth: TABLE_WIDTH * 0.20, halign: 'right' },
      2: { cellWidth: TABLE_WIDTH * 0.20, halign: 'right' },
      3: { cellWidth: TABLE_WIDTH * 0.25, halign: 'right' }
    },
    styles: {
      fontSize: 8,
      cellPadding: 1.5,
      lineColor: [200, 200, 200],
      lineWidth: 0.1
    },
    margin: { left: LEFT_MARGIN, right: RIGHT_MARGIN }
  });
}

function addTransactions(doc: jsPDF, transactions: Transaction[], accounts: Account[], closure: DailyClosure) {
  doc.setFontSize(12);
  doc.text('Movimientos', LEFT_MARGIN, (doc as any).lastAutoTable.finalY + 8);

  const transactionsData = transactions.map(transaction => [
    formatDateTime(transaction.timestamp),
    transaction.concept,
    transaction.description,
    accounts.find(a => a.id === transaction.accountId)?.name,
    transaction.status,
    formatAmount(transaction.amount)
  ]);

  (doc as any).autoTable({
    startY: (doc as any).lastAutoTable.finalY + 11,
    head: [['Fecha', 'Concepto', 'Descripción', 'Cuenta', 'Estado', { content: '$ Monto', styles: { halign: 'right' } }]],
    body: transactionsData,
    theme: 'grid',
    headStyles: {
      fillColor: [80, 80, 80],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      cellPadding: 1.5,
      fontSize: 8
    },
    columnStyles: {
      0: { cellWidth: TABLE_WIDTH * 0.15 },
      1: { cellWidth: TABLE_WIDTH * 0.20 },
      2: { cellWidth: TABLE_WIDTH * 0.25 },
      3: { cellWidth: TABLE_WIDTH * 0.17 },
      4: { cellWidth: TABLE_WIDTH * 0.11 },
      5: { cellWidth: TABLE_WIDTH * 0.12, halign: 'right', fontStyle: 'bold' }
    },
    styles: {
      fontSize: 7,
      cellPadding: { top: 1, bottom: 1, left: 2, right: 2 },
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
      overflow: 'linebreak'
    },
    margin: { left: LEFT_MARGIN, right: RIGHT_MARGIN },
    didDrawPage: (data: any) => {
      if (data.pageCount > 1) {
        doc.setFontSize(8);
        doc.text(`Cierre Diario - ${formatDate(closure.date)} - Página ${data.pageCount}`, 105, 8, { align: 'center' });
      }
    }
  });
}

function addTotalsSummary(doc: jsPDF, accounts: Account[], finalBalance: number) {
  const { cashTotal, bankTotal, creditTotal } = calculateAccountTotals(accounts);
  let currentY = (doc as any).lastAutoTable.finalY + 8;

  const summaryData = [[
    'Efectivo',
    formatAmount(cashTotal),
    'Banco',
    formatAmount(bankTotal),
    'Crédito',
    formatAmount(creditTotal),
    'Balance',
    formatAmount(finalBalance)
  ]];

  (doc as any).autoTable({
    startY: currentY,
    head: [[
      '',
      { content: '$ Monto', styles: { halign: 'right' } },
      '',
      { content: '$ Monto', styles: { halign: 'right' } },
      '',
      { content: '$ Monto', styles: { halign: 'right' } },
      '',
      { content: '$ Monto', styles: { halign: 'right' } }
    ]],
    body: summaryData,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
      fillColor: [245, 245, 245]
    },
    headStyles: {
      fillColor: [80, 80, 80],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      cellPadding: 1.5,
      fontSize: 8
    },
    columnStyles: {
      0: { cellWidth: TABLE_WIDTH * 0.10, fontStyle: 'bold' },
      1: { cellWidth: TABLE_WIDTH * 0.15, halign: 'right' },
      2: { cellWidth: TABLE_WIDTH * 0.10, fontStyle: 'bold' },
      3: { cellWidth: TABLE_WIDTH * 0.15, halign: 'right' },
      4: { cellWidth: TABLE_WIDTH * 0.10, fontStyle: 'bold' },
      5: { cellWidth: TABLE_WIDTH * 0.15, halign: 'right' },
      6: { cellWidth: TABLE_WIDTH * 0.10, fontStyle: 'bold' },
      7: { cellWidth: TABLE_WIDTH * 0.15, halign: 'right', fontStyle: 'bold' }
    },
    margin: { left: LEFT_MARGIN, right: RIGHT_MARGIN }
  });
}

function addObservations(doc: jsPDF, observations: string) {
  if (!observations?.trim()) return;

  let currentY = (doc as any).lastAutoTable.finalY + 15;

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Observaciones', LEFT_MARGIN, currentY);
  currentY += 5;

  doc.setFontSize(8);
  const maxWidth = TABLE_WIDTH;
  const splitObservations = doc.splitTextToSize(observations, maxWidth);

  if (currentY + (splitObservations.length * 3.5) > doc.internal.pageSize.height - 25) {
    doc.addPage();
    currentY = 20;
  }

  doc.text(splitObservations, LEFT_MARGIN, currentY);
}

function addSignature(doc: jsPDF) {
  let currentY = doc.internal.pageSize.height - 25;

  doc.setDrawColor(0, 0, 0);
  doc.line(LEFT_MARGIN, currentY, LEFT_MARGIN + 66, currentY);
  doc.setFontSize(8);
  doc.text('Firma del Responsable', LEFT_MARGIN, currentY + 4);
}

export function generateClosurePDF({
  closure,
  accounts,
  transactions,
  observations
}: GeneratePDFParams) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  addHeader(doc, closure);
  addAccountsSummary(doc, accounts);
  addTransactions(doc, transactions, accounts, closure);
  addTotalsSummary(doc, accounts, closure.finalBalance);
  addObservations(doc, observations);
  addSignature(doc);

  return doc;
}