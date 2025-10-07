import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Necesitamos el módulo 'path' de Node para resolver las rutas
// import { VitePWA } from 'vite-plugin-pwa' // Puedes descomentar esto cuando lo necesites

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // VitePWA({ ... }) // Tu configuración de PWA puede ir aquí
  ],
  // Esta es la sección clave que resuelve el error.
  // Le dice a Vite cómo interpretar las rutas absolutas.
  resolve: {
    alias: {
      // Cuando Vite vea una importación que empieza con 'components',
      // la buscará en la carpeta física './src/components'.
      'components': path.resolve(__dirname, './src/components'),
      'utils': path.resolve(__dirname, './src/utils'),
      'types': path.resolve(__dirname, './src/types'),
    },
  },
})