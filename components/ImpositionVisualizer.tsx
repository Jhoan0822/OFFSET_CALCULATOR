import React from 'react';

interface ImpositionVisualizerProps {
  sheetWidth: number;
  sheetHeight: number;
  itemWidth: number;
  itemHeight: number;
  orientation: 'normal' | 'rotated' | 'none';
  designImage: string | null;
}

export const ImpositionVisualizer: React.FC<ImpositionVisualizerProps> = ({
  sheetWidth,
  sheetHeight,
  itemWidth,
  itemHeight,
  orientation,
  designImage,
}) => {
  if (orientation === 'none' || !itemWidth || !itemHeight) {
    return (
      <div className="aspect-video bg-slate-200 rounded-md flex items-center justify-center">
        <p className="text-sm text-slate-500 p-4 text-center">No es posible realizar la imposición con las dimensiones actuales.</p>
      </div>
    );
  }

  const effectiveItemWidth = orientation === 'normal' ? itemWidth : itemHeight;
  const effectiveItemHeight = orientation === 'normal' ? itemHeight : itemWidth;

  const cols = Math.floor(sheetWidth / effectiveItemWidth);
  const rows = Math.floor(sheetHeight / effectiveItemHeight);
  const totalItems = cols * rows;

  if (totalItems === 0) {
     return (
      <div className="aspect-video bg-slate-200 rounded-md flex items-center justify-center">
        <p className="text-sm text-slate-500 p-4 text-center">El trabajo no cabe en el pliego seleccionado.</p>
      </div>
    );
  }

  const items = Array.from({ length: totalItems }, (_, i) => i);
  
  const aspectRatio = sheetWidth / sheetHeight;

  return (
    <div className="w-full bg-slate-50 p-4 border border-slate-200 rounded-lg">
      <div
        className="relative bg-white shadow-inner mx-auto border"
        style={{
          aspectRatio: `${aspectRatio}`,
        }}
      >
        <div 
          className="grid gap-px p-px bg-slate-300"
          style={{
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              width: `${(cols * effectiveItemWidth / sheetWidth) * 100}%`,
              height: `${(rows * effectiveItemHeight / sheetHeight) * 100}%`,
          }}
        >
          {items.map((i) => (
            <div
              key={i}
              className="bg-indigo-200 border border-indigo-300 bg-center bg-no-repeat"
              style={{
                backgroundImage: designImage ? `url(${designImage})` : 'none',
                backgroundSize: 'contain'
              }}
            >
              {!designImage && (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-indigo-700 text-[8px] font-mono select-none overflow-hidden whitespace-nowrap">
                      {effectiveItemWidth.toFixed(1)}x{effectiveItemHeight.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
       <div className="text-xs text-slate-500 mt-2 text-center">
        Pliego: {sheetWidth}cm x {sheetHeight}cm
      </div>
    </div>
  );
};