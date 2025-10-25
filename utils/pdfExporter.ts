// src/utils/pdfExporter.ts

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { QuoteDetails, FormState } from '../types';
import { generateQuoteTextData } from './textGenerator';
import logoSrc from '/cotizadorbanner.png'; // Importa la ruta del logo directamente

export const exportToPDF = async (
    quote: QuoteDetails,
    formState: FormState,
    visualizerElement: HTMLElement | null,
    // Ya no necesitamos el elemento del logo, la ruta es suficiente
) => {
    try {
        const doc = new jsPDF('p', 'pt', 'letter');
        const data = generateQuoteTextData(quote, formState);
        const margin = 40;
        let y = margin;

        // --- PÁGINA 1: BANNER Y TEXTO ---

        // === CAMBIO CLAVE: Cargar el logo directamente sin html2canvas ===
        const logoImg = new Image();
        logoImg.src = logoSrc;
        
        // Esperar a que la imagen se cargue en memoria
        await new Promise(resolve => { logoImg.onload = resolve; });

        const logoWidth = doc.internal.pageSize.getWidth() - 2 * margin;
        const logoHeight = (logoImg.height * logoWidth) / logoImg.width;
        doc.addImage(logoImg, 'PNG', margin, y, logoWidth, logoHeight);
        y += logoHeight + 20;

        // --- El resto del código permanece igual ---
        doc.setFontSize(18); doc.setFont('helvetica', 'bold'); doc.text(data.title, margin, y); y += 20;
        doc.setFontSize(11); doc.setFont('helvetica', 'normal'); doc.text(data.orderNumber, margin, y); y += 25;
        
        doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.text(data.jobDetailsTitle, margin, y); y += 15;
        doc.setFontSize(10); doc.setFont('helvetica', 'normal');
        const jobDetailsLines = [data.dimensions, data.quantity, data.paper, data.sheet, data.printing, data.finishes];
        doc.text(jobDetailsLines, margin, y); y += jobDetailsLines.length * 15 + 10;

        doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.text(data.costBreakdownTitle, margin, y); y += 15;
        doc.setFontSize(10); doc.setFont('helvetica', 'normal');
        const costLines = [data.itemsPerSheet, data.sheetsWithWaste, data.paperCost, data.plateCost, data.printCost, data.finishingCost];
        doc.text(costLines, margin, y); y += costLines.length * 15 + 10;
        
        doc.setDrawColor(200); doc.line(margin, y, 572, y); y += 20;
        
        doc.setFontSize(10); doc.text(data.subtotal, margin, y); y += 15;
        if (formState.applyTax) { doc.text(data.tax, margin, y); y += 15; }
        doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.text(data.total, margin, y);

        // --- PÁGINA 2: VISUALIZACIÓN (Sigue usando html2canvas, lo cual está bien) ---

        if (visualizerElement) {
            doc.addPage();
            y = margin;

            doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.text('Visualización de Imposición', margin, y);
            y += 20;

            const vizCanvas = await html2canvas(visualizerElement, { scale: 3, backgroundColor: '#ffffff' });
            const vizImgData = vizCanvas.toDataURL('image/png');
            
            const vizImgProps = doc.getImageProperties(vizImgData);
            const vizPdfWidth = doc.internal.pageSize.getWidth() - 2 * margin;
            const vizPdfHeight = (vizImgProps.height * vizPdfWidth) / vizImgProps.width;

            doc.addImage(vizImgData, 'PNG', margin, y, vizPdfWidth, vizPdfHeight);
        }
        
        doc.save(`cotizacion_${formState.productionOrderNumber}.pdf`);

    } catch (error) {
        console.error("Error al generar el PDF:", error);
        alert("Hubo un problema al generar el PDF. Por favor, intente de nuevo.");
    }
};
