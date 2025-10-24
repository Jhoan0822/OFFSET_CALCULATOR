// src/components/ResultsDisplay.tsx

import React, { useRef } from 'react';
import type { QuoteDetails, FormState } from '../types';
import { Card } from './Card';
import { ImpositionVisualizer } from './ImpositionVisualizer';
import { exportToPDF } from '../utils/pdfExporter';
import { PAPER_SIZES, FINISHES_CONFIG } from '../constants';

interface ResultsDisplayProps {
  quote: QuoteDetails;
  formState: FormState;
}

const ResultRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-slate-200 last:border-b-0">
        <p className="text-sm text-slate-600">{label}</p>
        <p className="text-sm font-semibold text-slate-800">{value}</p>
    </div>
);

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
    }).format(value);
};

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ quote, formState }) => {
    const visualizerRef = useRef<HTMLDivElement>(null);
    const resultsCardRef = useRef<HTMLDivElement>(null);

    const handleExport = () => {
        exportToPDF(quote, formState, visualizerRef.current);
    };

    // --- LÓGICA DE WHATSAPP MEJORADA ---
    const generateWhatsAppMessage = () => {
        const activeFinishes = Object.keys(formState.finishes)
            .filter((key) => formState.finishes[key].enabled)
            .map((key) => FINISHES_CONFIG[key]?.name)
            .filter(Boolean)
            .join(', ');

        const messageParts = [
            `📄 *Cotización - Orden N°: ${formState.productionOrderNumber}*`,
            ``,
            `*Descripción:* ${formState.jobDescription || 'Trabajo de impresión'}`,
            `*Cantidad:* ${formState.quantity.toLocaleString('es-CO')} unidades`,
            `*Tamaño:* ${formState.jobWidth}cm x ${formState.jobHeight}cm`,
            ``,
            `*--- Desglose ---*`,
            `Costo Papel: ${formatCurrency(quote.paperCost)}`,
            `Costo Placas: ${formatCurrency(quote.plateCost)}`,
            `Costo Impresión: ${formatCurrency(quote.printCost)}`,
            `Acabados: ${formatCurrency(quote.finishingCost)}`,
            `*Acabados Activos:* ${activeFinishes || 'Ninguno'}`,
            ``,
            `*Subtotal:* ${formatCurrency(quote.subtotal)}`,
            formState.applyTax ? `*IVA (19%):* ${formatCurrency(quote.tax)}` : '',
            `--------------------`,
            `*TOTAL: ${formatCurrency(quote.total)}*`,
        ];

        return messageParts.filter(part => part !== '').join('\n');
    };

    const handleShareToWhatsApp = () => {
        const message = generateWhatsAppMessage();
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    };
    
    const handlePrint = () => {
        window.print();
    };

    const hasResults = quote.itemsPerSheet > 0;
    const selectedPaper = PAPER_SIZES[formState.selectedPaperIndex];

    return (
        <Card className="space-y-6" ref={resultsCardRef} id="print-area">
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Cotización</h2>
                <p className="text-sm font-mono text-slate-500 mb-4">Orden: {formState.productionOrderNumber}</p>

                {hasResults ? (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-md font-semibold text-slate-800 mb-2">Resumen de Imposición</h3>
                            <ResultRow label="Cabida por Pliego" value={`${quote.itemsPerSheet} unidades`} />
                            <ResultRow label="Pliegos Necesarios" value={quote.sheetsNeeded.toLocaleString('es-CO')} />
                            <ResultRow label="Pliegos con Desperdicio" value={quote.sheetsWithWaste.toLocaleString('es-CO')} />
                        </div>
                        
                        <div ref={visualizerRef}>
                           <h3 className="text-md font-semibold text-slate-800 my-2">Visualización</h3>
                            <ImpositionVisualizer
                                sheetWidth={selectedPaper.width}
                                sheetHeight={selectedPaper.height}
                                itemWidth={formState.jobWidth}
                                itemHeight={formState.jobHeight}
                                orientation={quote.bestOrientation}
                                designImage={formState.designImage}
                            />
                        </div>

                        <div>
                            <h3 className="text-md font-semibold text-slate-800 mb-2">Desglose de Costos</h3>
                            <ResultRow label="Costo de Papel" value={formatCurrency(quote.paperCost)} />
                            <ResultRow label={`Placas (${quote.calculatedPlates} un.)`} value={formatCurrency(quote.plateCost)} />
                            <ResultRow label="Costo de Impresión" value={formatCurrency(quote.printCost)} />
                            <ResultRow label="Costo de Acabados" value={formatCurrency(quote.finishingCost)} />
                        </div>

                        <div>
                            <ResultRow label="Subtotal" value={formatCurrency(quote.subtotal)} />
                            {formState.applyTax && <ResultRow label="IVA (19%)" value={formatCurrency(quote.tax)} />}
                            <div className="flex justify-between items-center pt-3 mt-2 border-t-2 border-slate-300">
                                <p className="text-lg font-bold text-slate-700">Total</p>
                                <p className="text-lg font-bold text-indigo-600">{formatCurrency(quote.total)}</p>
                            </div>
                        </div>

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
                                ? 'El tamaño del trabajo es más grande que el papel seleccionado. Por favor, ajuste las dimensiones o elija un formato de papel más grande.'
                                : 'Ingrese los detalles del trabajo para ver la cotización.'}
                        </p>
                    </div>
                )}
            </div>
        </Card>
    );
};
