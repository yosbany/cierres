# Cierres Diarios - Sistema de Gestión de Cierres Diarios

Sistema web para la gestión de cierres diarios, control de movimientos y seguimiento de saldos en diferentes cuentas.

## 📝 Paso a Paso: De bot.new a GitHub Pages

### 1. Obtener el Código desde bot.new

1. Visitar [bot.new](https://bot.new)
2. Descargar el código del proyecto usando el botón "Download"
3. Descomprimir el archivo descargado

### 2. Preparar el Repositorio en GitHub

1. Crear un nuevo repositorio en GitHub
   - Ir a [github.com/new](https://github.com/new)
   - Nombrar el repositorio (ejemplo: "cierres")
   - No inicializar con README
   - Crear el repositorio

2. Inicializar el repositorio local
   ```bash
   cd cierres-diarios
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<tu-usuario>/cierres.git
   git push -u origin main
   ```

### 3. Configurar el Proyecto para GitHub Pages

1. Actualizar `package.json`:
   ```bash
   # Agregar homepage y scripts
   npm pkg set homepage="https://<tu-usuario>.github.io/cierres"
   npm pkg set scripts.predeploy="npm run build"
   npm pkg set scripts.deploy="gh-pages -d dist"
   ```

2. Actualizar `vite.config.ts`:
   ```typescript
   export default defineConfig({
     plugins: [react()],
     base: './',
     // ... resto de la configuración
   });
   ```

3. Modificar `src/App.tsx` para usar HashRouter:
   ```typescript
   import { HashRouter as Router } from 'react-router-dom';
   // Reemplazar BrowserRouter por HashRouter
   ```

### 4. Instalar Dependencias y Desplegar

1. Instalar dependencias:
   ```bash
   npm install
   npm install --save-dev gh-pages
   ```

2. Construir y desplegar:
   ```bash
   npm run deploy
   ```

3. Verificar el despliegue:
   - Ir a Settings > Pages en el repositorio de GitHub
   - Confirmar que la fuente está configurada en rama gh-pages
   - Esperar unos minutos hasta que GitHub Pages publique el sitio
   - Visitar https://<tu-usuario>.github.io/cierres

### 5. Actualizaciones Posteriores

Para actualizar el sitio después de cambios:
```bash
# Hacer cambios en el código
git add .
git commit -m "Descripción de los cambios"
git push origin main

# Redesplegar a GitHub Pages
npm run deploy
```

## 🌟 Características Principales

### Gestión de Cierres

- Creación y gestión de cierres diarios
- Control de saldos iniciales y finales
- Estado de cierres (abierto/cerrado)
- Observaciones por cierre

### Movimientos

- Registro de ingresos y egresos
- Sistema de etiquetas para descripciones
- Seguimiento de estados de movimientos
- Transferencias entre cuentas
- Historial completo de transacciones

### Cuentas

- Soporte para múltiples tipos de cuentas (efectivo/banco)
- Control de saldos por cuenta
- Resumen de totales
- Transferencias entre cuentas

### Reportes

- Exportación a PDF
- Resumen de saldos
- Historial de movimientos
- Filtros y búsquedas

### Seguridad

- Autenticación de usuarios
- Control de acceso
- Registro de actividades

## 🛠️ Desarrollo Local

1. **Requisitos Previos**

   - Node.js (v16 o superior)
   - npm o yarn

2. **Instalación**

   ```bash
   # Instalar dependencias
   npm install

   # Iniciar servidor de desarrollo
   npm run dev
   ```

3. **Variables de Entorno**
   - Copiar `.env.example` a `.env`
   - Configurar las variables de Firebase

## 📦 Tecnologías Utilizadas

- React 18
- TypeScript
- Vite
- Firebase (Auth & Realtime Database)
- Tailwind CSS
- Lucide React (iconos)
- React Router
- React Hot Toast
- jsPDF

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.