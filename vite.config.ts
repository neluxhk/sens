import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  // ✅ MANTENER tu base y aliases
  base: '/',
  resolve: {
    alias: {
      'components': path.resolve(__dirname, './src/components'),
      'utils': path.resolve(__dirname, './src/utils'),
      'types': path.resolve(__dirname, './src/types'),
    },
  },
  
  // ✅ NUEVA CONFIGURACIÓN BUILD OPTIMIZADA
  build: {
    // ✅ MANTENER tus opciones con mejoras
    chunkSizeWarningLimit: 2000,
    minify: 'esbuild',
    sourcemap: false,
    
    rollupOptions: {
      output: {
        // ✅ ESTRATEGIA HÍBRIDA - Tus chunks + separación segura
        manualChunks: (id) => {
          // 1. PRIMERO - Separar librerías pesadas (NUEVO)
          if (id.includes('node_modules')) {
            // ✅ SEPARAR PDF - 676KB + 343KB
            if (id.includes('jspdf') || id.includes('html2canvas')) {
              return 'vendor-pdf';
            }
            
            // ✅ SEPARAR ANIMACIONES - 378KB
            if (id.includes('framer-motion')) {
              return 'vendor-animations';
            }
            
            // ✅ SEPARAR INTERNACIONALIZACIÓN
            if (id.includes('react-i18next') || id.includes('i18next')) {
              return 'vendor-i18n';
            }
            
            // ✅ SEPARAR ROUTING
            if (id.includes('react-router-dom')) {
              return 'vendor-router';
            }
            
            // ✅ PLOTLY + REACT en vendor principal (SEGURO)
            return 'vendor-main';
          }
          
          // 2. LUEGO - MANTENER tus chunks personalizados
          if (id.includes('/src/components/')) return 'components';
          if (id.includes('/src/utils/')) return 'utils';
          if (id.includes('/src/pages/')) return 'pages';
          
          // Chunks por defecto
          return null;
        },
        
        // ✅ MANTENER tu estructura de nombres
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  },
  
  // ✅ OPTIMIZACIÓN EXTRA (NUEVO)
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-plotly.js'] // Plotly pre-optimizado
  }
})