export const ACCOUNT_TYPES = {
  CASH: 'efectivo',
  BANK: 'banco',
  CREDIT: 'credito'
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
  'account-5': {
    name: 'Caja Banca Juegos',
    type: ACCOUNT_TYPES.CASH
  },
  'account-3': {
    name: 'Cuenta Débito Santander',
    type: ACCOUNT_TYPES.BANK
  },
  'account-4': {
    name: 'Cuenta Crédito Visa Santander',
    type: ACCOUNT_TYPES.CREDIT
  }
} as const;

export const CONCEPT_TYPES = {
  INCOME: 'ingreso',
  EXPENSE: 'egreso'
} as const;

export const TRANSACTION_STATES = {
  PENDING_INVOICE: {
    id: 'pending-invoice',
    name: 'Pendiente a Facturar',
    order: 1,
    isFinal: false,
    description: `
      <div class="space-y-4">
        <p>Este movimiento requiere generar una factura en el sistema de facturación electrónica.</p>
        
        <div class="bg-blue-50 p-4 rounded-lg">
          <p class="font-medium text-blue-800 mb-2">Sistema a utilizar:</p>
          <div class="flex items-center gap-2 text-blue-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <a href="https://go.zureo.com/" target="_blank" class="hover:underline">
              Zureo - Sistema de Facturación Electrónica
            </a>
          </div>
        </div>

        <div class="space-y-2">
          <p class="font-medium">Pasos a seguir:</p>
          <ul class="list-disc pl-5 space-y-2">
            <li>Acceder al sistema Zureo</li>
            <li>Para productos con control de inventario:
              <ul class="list-circle pl-5 mt-1 text-gray-600">
                <li>Registrar la compra producto por producto</li>
                <li>Verificar cantidades y precios</li>
                <li>Actualizar el stock en el sistema</li>
              </ul>
            </li>
            <li>Generar la factura electrónica correspondiente</li>
            <li>Verificar que los montos coincidan con el movimiento</li>
          </ul>
        </div>

        <div class="bg-yellow-50 p-4 rounded-lg">
          <p class="text-yellow-800">
            <strong>Importante:</strong> Para productos con control de inventario, es crucial registrar cada ítem individualmente para mantener un control preciso del stock.
          </p>
        </div>
      </div>
    `
  },
  PENDING_ACCOUNTING: {
    id: 'pending-accounting',
    name: 'Pendiente a Contabilizar',
    order: 2,
    isFinal: false,
    description: `
      <div class="space-y-4">
        <p>Este movimiento debe ser registrado en el sistema contable.</p>

        <div class="bg-blue-50 p-4 rounded-lg">
          <p class="font-medium text-blue-800 mb-2">Sistema a utilizar:</p>
          <div class="flex items-center gap-2 text-blue-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <a href="https://nuevariodor.manager.io/" target="_blank" class="hover:underline">
              Manager - Sistema Contable
            </a>
          </div>
        </div>

        <div class="space-y-2">
          <p class="font-medium">Proceso de registro:</p>
          <ul class="list-disc pl-5 space-y-2">
            <li>Ingresar al sistema Manager</li>
            <li>Identificar la cuenta contable correspondiente</li>
            <li>Registrar el asiento contable con:
              <ul class="list-circle pl-5 mt-1 text-gray-600">
                <li>Fecha de la operación</li>
                <li>Cuentas involucradas</li>
                <li>Importes correspondientes</li>
                <li>Descripción detallada</li>
              </ul>
            </li>
            <li>Adjuntar documentación respaldatoria digitalizada</li>
          </ul>
        </div>

        <div class="bg-blue-50 p-4 rounded-lg">
          <p class="text-blue-800">
            <strong>Nota:</strong> Asegúrese de mantener la coherencia entre los registros contables y la documentación respaldatoria.
          </p>
        </div>
      </div>
    `
  },
  PENDING_PAYMENT: {
    id: 'pending-payment',
    name: 'Pendiente a Pagar',
    order: 1,
    isFinal: false,
    description: `
      <div class="space-y-4">
        <p>Este movimiento está pendiente de pago y debe ser procesado en el sistema contable.</p>

        <div class="bg-blue-50 p-4 rounded-lg">
          <p class="font-medium text-blue-800 mb-2">Sistema a utilizar:</p>
          <div class="flex items-center gap-2 text-blue-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <a href="https://nuevariodor.manager.io/" target="_blank" class="hover:underline">
              Manager - Sistema Contable
            </a>
          </div>
        </div>

        <div class="space-y-2">
          <p class="font-medium">Pasos para el pago:</p>
          <ul class="list-disc pl-5 space-y-2">
            <li>Acceder al sistema Manager</li>
            <li>Localizar el movimiento pendiente de pago</li>
            <li>Verificar:
              <ul class="list-circle pl-5 mt-1 text-gray-600">
                <li>Monto a pagar</li>
                <li>Fecha de vencimiento</li>
                <li>Forma de pago acordada</li>
              </ul>
            </li>
            <li>Procesar el pago según el medio correspondiente</li>
            <li>Registrar el comprobante de pago en el sistema</li>
          </ul>
        </div>

        <div class="bg-yellow-50 p-4 rounded-lg">
          <p class="text-yellow-800">
            <strong>Importante:</strong> Verificar la disponibilidad de fondos en la cuenta seleccionada antes de proceder con el pago.
          </p>
        </div>
      </div>
    `
  },
  PENDING_CONTROL: {
    id: 'pending-control',
    name: 'Pendiente a Controlar',
    order: 2,
    isFinal: false,
    description: `
      <div class="space-y-4">
        <p>Este movimiento requiere verificación y control, especialmente importante para compras a proveedores.</p>

        <div class="space-y-2">
          <p class="font-medium">Control de productos:</p>
          <ul class="list-disc pl-5 space-y-2">
            <li>Para compras a proveedores:
              <ul class="list-circle pl-5 mt-1 text-gray-600">
                <li>Verificar la cantidad recibida de cada producto</li>
                <li>Controlar la calidad de los productos</li>
                <li>Comparar con la orden de compra original</li>
                <li>Verificar precios facturados</li>
              </ul>
            </li>
            <li>Documentación a revisar:
              <ul class="list-circle pl-5 mt-1 text-gray-600">
                <li>Remito o documento de entrega</li>
                <li>Factura del proveedor</li>
                <li>Orden de compra</li>
              </ul>
            </li>
          </ul>
        </div>

        <div class="bg-yellow-50 p-4 rounded-lg">
          <p class="text-yellow-800">
            <strong>Importante:</strong> Reportar inmediatamente cualquier discrepancia encontrada durante el control.
          </p>
        </div>

        <div class="bg-green-50 p-4 rounded-lg">
          <p class="text-green-800">
            <strong>Recomendación:</strong> Mantener un registro fotográfico de los productos recibidos en caso de futuros reclamos.
          </p>
        </div>
      </div>
    `
  },
  COMPLETED: {
    id: 'completed',
    name: 'Finalizado',
    order: 3,
    isFinal: true,
    description: `
      <div class="space-y-4">
        <div class="bg-green-50 p-4 rounded-lg">
          <p class="text-green-800 font-medium">
            ¡Movimiento completado exitosamente!
          </p>
          <p class="mt-2">
            Este movimiento ha completado todos sus estados y ha sido procesado correctamente.
          </p>
        </div>

        <div class="space-y-2">
          <p class="font-medium">Verificaciones completadas:</p>
          <ul class="space-y-2">
            <li class="flex items-center text-green-700">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Documentación completa y verificada
            </li>
            <li class="flex items-center text-green-700">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Montos y cantidades confirmados
            </li>
            <li class="flex items-center text-green-700">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Registros actualizados en todos los sistemas
            </li>
            <li class="flex items-center text-green-700">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Controles y validaciones aprobados
            </li>
          </ul>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="text-gray-600 text-sm">
            No se requieren más acciones para este movimiento. Toda la documentación y registros han sido procesados correctamente.
          </p>
        </div>
      </div>
    `
  }
} as const;

export const DEFAULT_CONCEPTS = {
  'concept-1': {
    name: '(+) Ingresos por Venta',
    type: CONCEPT_TYPES.INCOME,
    states: [
      TRANSACTION_STATES.PENDING_ACCOUNTING,
      TRANSACTION_STATES.COMPLETED
    ]
  },
  'concept-2': {
    name: '(+) Ingresos Varios',
    type: CONCEPT_TYPES.INCOME,
    states: [
      TRANSACTION_STATES.PENDING_ACCOUNTING,
      TRANSACTION_STATES.COMPLETED
    ]
  },
  'concept-3': {
    name: '(-) Pago a Proveedores',
    type: CONCEPT_TYPES.EXPENSE,
    states: [
      TRANSACTION_STATES.PENDING_INVOICE,
      TRANSACTION_STATES.PENDING_ACCOUNTING,
      TRANSACTION_STATES.PENDING_PAYMENT,
      TRANSACTION_STATES.COMPLETED
    ]
  },
  'concept-4': {
    name: '(-) Pago de Servicios',
    type: CONCEPT_TYPES.EXPENSE,
    states: [
      TRANSACTION_STATES.PENDING_ACCOUNTING,
      TRANSACTION_STATES.PENDING_PAYMENT,
      TRANSACTION_STATES.COMPLETED
    ]
  },
  'concept-5': {
    name: '(-) Salarios',
    type: CONCEPT_TYPES.EXPENSE,
    states: [
      TRANSACTION_STATES.PENDING_ACCOUNTING,
      TRANSACTION_STATES.PENDING_PAYMENT,
      TRANSACTION_STATES.COMPLETED
    ]
  },
  'concept-6': {
    name: '(-) Egresos Varios',
    type: CONCEPT_TYPES.EXPENSE,
    states: [
      TRANSACTION_STATES.PENDING_ACCOUNTING,
      TRANSACTION_STATES.COMPLETED
    ]
  }
} as const;