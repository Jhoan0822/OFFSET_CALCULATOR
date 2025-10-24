import React, { useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import 'pdfjs-dist/build/pdf.worker.mjs';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://aistudiocdn.com/pdfjs-dist@4.4.168/build/pdf.worker.mjs`;

interface ImageInputProps {
  label: string;
  onChange: (base64: string | null) => void;
  previewImage: string | null;
}

const renderPdfToImage = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const context = canvas.getContext('2d');

    if (!context) {
        throw new Error('Could not get canvas context');
    }
    
    await page.render({ canvasContext: context, viewport: viewport }).promise;
    return canvas.toDataURL('image/png');
};


export const ImageInput: React.FC<ImageInputProps> = ({ label, onChange, previewImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setIsLoadingPdf(true);
        try {
            const imageBase64 = await renderPdfToImage(file);
            onChange(imageBase64);
        } catch (error) {
            console.error("Error rendering PDF:", error);
            onChange(null);
            alert("No se pudo procesar el archivo PDF. Intente con otro archivo.");
        } finally {
            setIsLoadingPdf(false);
        }
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          onChange(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleRemoveImage = () => {
    onChange(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className="col-span-full">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="mt-1 flex items-center gap-4">
        <div className="h-24 w-24 rounded-md bg-slate-100 flex items-center justify-center overflow-hidden border">
          {previewImage ? (
            <img src={previewImage} alt="Vista previa" className="h-full w-full object-contain" />
          ) : isLoadingPdf ? (
             <div className="p-2 text-slate-500 flex flex-col items-center justify-center">
                <span className="text-xs text-slate-500 mt-1">Procesando PDF...</span>
             </div>
          ) : (
            <span className="text-xs text-slate-400 text-center">Sin imagen</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
           <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            disabled={isLoadingPdf}
          />
          {previewImage && !isLoadingPdf && (
             <button
                type="button"
                onClick={handleRemoveImage}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Quitar imagen
              </button>
          )}
        </div>
      </div>
    </div>
  );
};