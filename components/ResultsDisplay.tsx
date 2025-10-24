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
    const logoRef = useRef<HTMLDivElement>(null); // Ref para el div del logo

    const textData = generateQuoteTextData(quote, formState);

    // === CAMBIO AQUÍ: La función ahora es async para usar await ===
    const handleExport = async () => {
        await exportToPDF(quote, formState, visualizerRef.current, logoRef.current);
    };

    const handleShareToWhatsApp = () => {
        const message = [
            `*${textData.title}*`, textData.orderNumber, '',
            `*${textData.jobDetailsTitle}*`, textData.dimensions, textData.quantity, textData.paper,
            textData.sheet, textData.printing, textData.finishes, '',
            `*${textData.costBreakdownTitle}*`, textData.itemsPerSheet, textData.sheetsWithWaste, textData.paperCost,
            textData.plateCost, textData.printCost, textData.finishingCost, '',
            `*${textData.summaryTitle}*`, textData.subtotal,
            formState.applyTax ? textData.tax : '', '--------------------', `*${textData.total}*`,
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
                {/* === CAMBIO AQUÍ: Banner solo visible para imprimir/PDF === */}
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
                            <div ref={visualizerRef}>
                               <h3 className="text-md font-semibold text-slate-800 my-2">Visualización de Imposición</h3>
                                <ImpositionVisualizer {...} />
                            </div>
                            <div>
                                <h3 className="text-md font-semibold text-slate-800 mb-2">{textData.summaryTitle}</h3>
                                {/* ... Resumen de costos */}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t no-print">
                                <button type="button" onClick={handleExport} className="...">Exportar a PDF</button>
                                <button onClick={handleShareToWhatsApp} className="...">{/* SVG */}</button>
                                <button type="button" onClick={handlePrint} className="...">{/* SVG */}</button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">{/* Mensaje de error */}</div>
                    )}
                </div>
            </Card>
        </div>
    );
};
