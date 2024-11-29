export const ACCOUNT_TYPES = {
  CASH: 'efectivo',
  BANK: 'banco'
} as const;

export const CONCEPT_TYPES = {
  INCOME: 'ingreso',
  EXPENSE: 'egreso'
} as const;

export const DEFAULT_ACCOUNTS = {
  'account-1': {
    name: 'Caja Cofre',
    type: ACCOUNT_TYPES.CASH
  },
  'account-2': {
    name: 'Caja Mostrador',
    type: ACCOUNT_TYPES.CASH
  },
  'account-3': {
    name: 'Cuenta Débito Santander',
    type: ACCOUNT_TYPES.BANK
  },
  'account-4': {
    name: 'Cuenta Crédito Santander',
    type: ACCOUNT_TYPES.BANK
  }
} as const;

export const TRANSACTION_STATES = {
  PENDING_INVOICE: {
    id: 'pending-invoice',
    name: 'Pendiente a Facturar',
    order: 1,
    isFinal: false,
    description: 'Este movimiento requiere generar una factura. Para completar este estado, debe emitir la factura correspondiente en el sistema de facturación y registrar el número de comprobante.'
  },
  PENDING_ACCOUNTING: {
    id: 'pending-accounting',
    name: 'Pendiente a Contabilizar',
    order: 2,
    isFinal: false,
    description: 'Este movimiento debe ser registrado en el sistema contable. Para avanzar, registre el asiento contable correspondiente y verifique que los montos coincidan.'
  },
  PENDING_PAYMENT: {
    id: 'pending-payment',
    name: 'Pendiente a Pagar',
    order: 1,
    isFinal: false,
    description: 'Este movimiento está pendiente de pago. Para completar este estado, realice el pago correspondiente y registre el comprobante de pago.'
  },
  PENDING_CONTROL: {
    id: 'pending-control',
    name: 'Pendiente a Controlar',
    order: 2,
    isFinal: false,
    description: 'Este movimiento requiere verificación y control. Revise la documentación respaldatoria y verifique que los montos y conceptos sean correctos antes de avanzar.'
  },
  COMPLETED: {
    id: 'completed',
    name: 'Finalizado',
    order: 3,
    isFinal: true,
    description: 'Este movimiento ha completado todos sus estados y ha sido procesado correctamente. No se requieren más acciones.'
  }
} as const;

export const DEFAULT_CONCEPTS = {
  'concept-1': {
    name: '(+) Ingresos por Venta',
    type: CONCEPT_TYPES.INCOME,
    states: [
      TRANSACTION_STATES.PENDING_INVOICE,
      TRANSACTION_STATES.PENDING_ACCOUNTING,
      TRANSACTION_STATES.COMPLETED
    ]
  },
  'concept-2': {
    name: '(+) Ingresos Varios',
    type: CONCEPT_TYPES.INCOME,
    states: [
      TRANSACTION_STATES.PENDING_PAYMENT,
      TRANSACTION_STATES.PENDING_CONTROL,
      TRANSACTION_STATES.COMPLETED
    ]
  },
  'concept-3': {
    name: '(-) Pago a Proveedores',
    type: CONCEPT_TYPES.EXPENSE,
    states: [
      TRANSACTION_STATES.PENDING_PAYMENT,
      TRANSACTION_STATES.COMPLETED
    ]
  },
  'concept-4': {
    name: '(-) Pago de Servicios',
    type: CONCEPT_TYPES.EXPENSE,
    states: [
      TRANSACTION_STATES.PENDING_PAYMENT,
      TRANSACTION_STATES.PENDING_ACCOUNTING,
      TRANSACTION_STATES.COMPLETED
    ]
  },
  'concept-5': {
    name: '(-) Salarios',
    type: CONCEPT_TYPES.EXPENSE,
    states: [
      TRANSACTION_STATES.PENDING_CONTROL,
      TRANSACTION_STATES.COMPLETED
    ]
  },
  'concept-6': {
    name: '(-) Egresos Varios',
    type: CONCEPT_TYPES.EXPENSE,
    states: [
      TRANSACTION_STATES.PENDING_CONTROL,
      TRANSACTION_STATES.COMPLETED
    ]
  }
} as const;