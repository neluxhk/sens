import { lazy, Suspense } from 'react';

// Tipos básicos si plotly.js da problemas
interface BasicPlotlyProps {
  data: any[];
  layout: any;
  config?: any;
  style?: React.CSSProperties;
  className?: string;
}

const Plot = lazy(() => import('react-plotly.js'));

const PlotLoadingFallback = () => (
  <div style={{ 
    width: '100%', 
    height: '400px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    border: '1px dashed #ccc',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px'
  }}>
    <div>🔄 Cargando gráfico optimizado...</div>
  </div>
);

export default function PlotlyOptimized({ 
  data, 
  layout, 
  config, 
  style,
  className 
}: BasicPlotlyProps) {
  const optimizedConfig = {
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: [
      'pan2d', 'select2d', 'lasso2d', 
      'zoomIn2d', 'zoomOut2d', 'autoScale2d', 
      'resetScale2d', 'hoverClosestCartesian', 
      'hoverCompareCartesian', 'toggleSpikelines'
    ],
    ...config
  };

  return (
    <Suspense fallback={<PlotLoadingFallback />}>
      <Plot
        data={data}
        layout={layout}
        config={optimizedConfig}
        style={style}
        className={className}
      />
    </Suspense>
  );
}