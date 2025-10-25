// src/components/ResultsDisplay.tsx

import React, { useRef } from 'react';
import type { QuoteDetails, FormState } from '../types';
import { Card } from './Card';
import { ImpositionVisualizer } from './ImpositionVisualizer';
import { exportToPDF } from '../utils/pdfExporter';
import { generateQuoteTextData } from '../utils/textGenerator';
import { PAPER_SIZES } from '../constants';
import logoSrc from '/cotizadorbanner.png';

interface ResultsDisplayProps {
  quote: QuoteDetails;
  formState: FormState;
}

const InfoSection: React.FC<{ title: string; lines: string[] }> = ({ title, lines }) => (
    <div>
        <h3 className="text-md font-semibold text-slate-800 mb-2 border-b pb-1">{title}</h3>
        <div className="space-y-1 text-sm text-slate-700">
            {lines.map((line, index) => ( <p key={index}>{line}</p> ))}
        </div>
    </div>
);

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ quote, formState }) => {
    const visualizerRef = useRef<HTMLDivElement>(null);
    const resultsCardRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);

    const textData = generateQuoteTextData(quote, formState);

    const handleExport = async () => {
    // ESTA ES LA LÍNEA CORRECTA
    await exportToPDF(quote, formState, visualizerRef.current);
    };

    const handleShareToWhatsApp = () => {
        const message = [
            `*${textData.title}*`, textData.orderNumber, '', `*${textData.jobDetailsTitle}*`,
            textData.dimensions, textData.quantity, textData.paper, textData.sheet,
            textData.printing, textData.finishes, '', `*${textData.costBreakdownTitle}*`,
            textData.itemsPerSheet, textData.sheetsWithWaste, textData.paperCost, textData.plateCost,
            textData.printCost, textData.finishingCost, '', `*${textData.summaryTitle}*`,
            textData.subtotal, formState.applyTax ? textData.tax : '', '--------------------', `*${textData.total}*`,
        ].filter(Boolean).join('\n');
        
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    };
    
    const handlePrint = () => { window.print(); };

    const hasResults = quote.itemsPerSheet > 0;
    const selectedPaper = PAPER_SIZES[formState.selectedPaperIndex];

    return (
        <div id="print-area"> 
            <Card className="space-y-6" ref={resultsCardRef}>
                <div ref={logoRef} className="print-only">
                    <img src={logoSrc} alt="Cotizador Banner" className="w-full h-auto rounded-lg shadow-md mb-8" />
                </div>

                <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">{textData.title}</h2>
                    <p className="text-sm font-mono text-slate-500 mb-6">{textData.orderNumber}</p>

                    {hasResults ? (
                        <div className="space-y-6">
                            <InfoSection title={textData.jobDetailsTitle} lines={[textData.dimensions, textData.quantity, textData.paper, textData.sheet, textData.printing, textData.finishes]} />
                            <InfoSection title={textData.costBreakdownTitle} lines={[textData.itemsPerSheet, textData.sheetsWithWaste, textData.paperCost, textData.plateCost, textData.printCost, textData.finishingCost]} />
                            
                            <div>
                                <h3 className="text-md font-semibold text-slate-800 mb-2">{textData.summaryTitle}</h3>
                                <p className="text-sm text-slate-700">{textData.subtotal}</p>
                                {formState.applyTax && <p className="text-sm text-slate-700">{textData.tax}</p>}
                                <div className="flex justify-between items-center pt-3 mt-2 border-t-2 border-slate-300">
                                    <p className="text-lg font-bold text-slate-700">Total</p>
                                    <p className="text-lg font-bold text-indigo-600">{textData.total.replace('Total: ', '')}</p>
                                </div>
                            </div>
                            
                            <div ref={visualizerRef} className="print-page-break">
                               <h3 className="text-md font-semibold text-slate-800 my-2">Visualización de Imposición</h3>
                                <ImpositionVisualizer
                                    sheetWidth={selectedPaper.width}
                                    sheetHeight={selectedPaper.height}
                                    itemWidth={formState.jobWidth}
                                    itemHeight={formState.jobHeight}
                                    orientation={quote.bestOrientation}
                                    designImage={formState.designImage}
                                />
                            </div>

                            {/* --- BOTONES COMPLETOS Y FUNCIONALES --- */}
                            <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t no-print">
                                <button
                                    type="button"
                                    onClick={handleExport}
                                    className="w-full flex-1 bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                                >
                                    Exportar a PDF
                                </button>
                                <button
                                    onClick={handleShareToWhatsApp}
                                    title="Compartir por WhatsApp"
                                    className="w-full sm:w-auto bg-green-500 text-white font-bold p-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.267.651 4.383 1.905 6.344l-1.332 4.869 4.895-1.309z"/></svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePrint}
                                    title="Imprimir"
                                    className="w-full sm:w-auto bg-slate-600 text-white font-bold p-2 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>
                                </button>
                            </div>

                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-slate-500">
                                {quote.bestOrientation === 'none' 
                                    ? 'El tamaño del trabajo es más grande que el papel seleccionado.'
                                    : 'Ingrese los detalles para ver la cotización.'}
                            </p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};
