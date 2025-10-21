import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      'components': path.resolve(__dirname, './src/components'),
      'utils': path.resolve(__dirname, './src/utils'),
      'types': path.resolve(__dirname, './src/types'),
    },
  },
  build: {
    chunkSizeWarningLimit: 2000, // aumenta el límite para que no aparezca la advertencia
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Todo lo que esté en node_modules va a 'vendor'
          if (id.includes('node_modules')) return 'vendor';

          // Separar automáticamente módulos por carpeta
          if (id.includes('/src/components/')) return 'components';
          if (id.includes('/src/utils/')) return 'utils';
          if (id.includes('/src/pages/')) return 'pages'; // si tienes carpetas por página
        }
      }
    }
  }
})
