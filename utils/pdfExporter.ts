// src/utils/pdfExporter.ts

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { QuoteDetails, FormState } from '../types';
import { generateQuoteTextData } from './textGenerator';

export const exportToPDF = async (
    quote: QuoteDetails,
    formState: FormState,
    visualizerElement: HTMLElement | null,
    logoElement: HTMLElement | null
) => {
    const doc = new jsPDF('p', 'pt', 'letter');
    const data = generateQuoteTextData(quote, formState);
    const margin = 40;
    let y = margin;

    // --- PÁGINA 1: BANNER Y TEXTO ---

    if (logoElement) {
        const canvas = await html2canvas(logoElement, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * margin;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(imgData, 'PNG', margin, y, pdfWidth, pdfHeight);
        y += pdfHeight + 20;
    }

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(data.title, margin, y);
    y += 20;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(data.orderNumber, margin, y);
    y += 25;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(data.jobDetailsTitle, margin, y);
    y += 15;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const jobDetailsLines = [data.dimensions, data.quantity, data.paper, data.sheet, data.printing, data.finishes];
    doc.text(jobDetailsLines, margin, y);
    y += jobDetailsLines.length * 15 + 10;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(data.costBreakdownTitle, margin, y);
    y += 15;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const costLines = [data.itemsPerSheet, data.sheetsWithWaste, data.paperCost, data.plateCost, data.printCost, data.finishingCost];
    doc.text(costLines, margin, y);
    y += costLines.length * 15 + 10;
    
    doc.setDrawColor(200);
    doc.line(margin, y, 572, y);
    y += 20;
    
    doc.setFontSize(10);
    doc.text(data.subtotal, margin, y);
    y += 15;
    if (formState.applyTax) {
        doc.text(data.tax, margin, y);
        y += 15;
    }
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(data.total, margin, y);

    // --- PÁGINA 2: VISUALIZACIÓN ---

    if (visualizerElement) {
        doc.addPage();
        y = margin;

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Visualización de Imposición', margin, y);
        y += 20;

        const canvas = await html2canvas(visualizerElement, { scale: 3, backgroundColor: '#ffffff' });
        const imgData = canvas.toDataURL('image/png');
        
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * margin;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        doc.addImage(imgData, 'PNG', margin, y, pdfWidth, pdfHeight);
    }
    
    doc.save(`cotizacion_${formState.productionOrderNumber}.pdf`);
};
