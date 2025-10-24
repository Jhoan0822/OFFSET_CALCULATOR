// src/utils/pdfExporter.ts

import jsPDF from 'jspdf';
import type { QuoteDetails, FormState } from '../types';
import { generateQuoteTextData } from './textGenerator';

export const exportToPDF = (
    quote: QuoteDetails,
    formState: FormState,
    visualizerElement: HTMLDivElement | null,
    logoImage: HTMLImageElement | null
) => {
    const doc = new jsPDF();
    const data = generateQuoteTextData(quote, formState);
    let yPos = 20;

    // 1. Añadir el Logo
    if (logoImage) {
        // Asegúrate de que las dimensiones del logo son adecuadas
        const logoWidth = 50;
        const logoHeight = (logoImage.height * logoWidth) / logoImage.width;
        doc.addImage(logoImage, 'PNG', 15, 15, logoWidth, logoHeight);
        yPos = 30 + logoHeight; // Ajusta la posición inicial del texto
    }

    // 2. Título y Nº de Orden
    doc.setFontSize(18);
    doc.text(data.title, 15, yPos);
    yPos += 10;
    doc.setFontSize(12);
    doc.text(data.orderNumber, 15, yPos);
    yPos += 15;

    // 3. Detalles del Trabajo
    doc.setFontSize(14);
    doc.text(data.jobDetailsTitle, 15, yPos);
    yPos += 7;
    doc.setFontSize(10);
    doc.text([data.dimensions, data.quantity, data.paper, data.finishes], 15, yPos);
    yPos += 25;

    // 4. Desglose de Costos
    doc.setFontSize(14);
    doc.text(data.costBreakdownTitle, 15, yPos);
    yPos += 7;
    doc.setFontSize(10);
    doc.text([
        data.itemsPerSheet, data.sheetsWithWaste, data.paperCost, 
        data.plateCost, data.printCost, data.finishingCost
    ], 15, yPos);
    yPos += 40;

    // 5. Resumen Total
    doc.setFontSize(12);
    doc.text(data.subtotal, 15, yPos);
    yPos += 7;
    if (formState.applyTax) {
        doc.text(data.tax, 15, yPos);
        yPos += 7;
    }
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(data.total, 15, yPos);
    yPos += 15;
    
    // 6. Visualización (Opcional, si se proporciona)
    if (visualizerElement) {
        doc.addPage();
        doc.text("Visualización de Imposición", 15, 20);
        // Aquí podrías usar html2canvas para añadir la visualización como imagen
        // Pero por simplicidad, lo dejaremos así por ahora.
    }

    doc.save(`cotizacion_${formState.productionOrderNumber}.pdf`);
};
