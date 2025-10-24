// src/utils/pdfExporter.ts

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { QuoteDetails, FormState } from '../types';
import { generateQuoteTextData } from './textGenerator';

export const exportToPDF = async (
    quote: QuoteDetails,
    formState: FormState,
    visualizerElement: HTMLElement | null
) => {
    const doc = new jsPDF('p', 'pt', 'letter');
    const data = generateQuoteTextData(quote, formState);
    const margin = 40;
    let y = margin;

    // Cargar el logo como un elemento de imagen
    const logoImg = new Image();
    logoImg.src = '/cotizadorbanner.png'; // Vite manejará la ruta desde 'public'
    
    // Esperar a que el logo cargue
    await new Promise(resolve => {
        logoImg.onload = resolve;
    });

    // 1. Añadir el Logo
    const logoWidth = 150;
    const logoHeight = (logoImg.height * logoWidth) / logoImg.width;
    doc.addImage(logoImg, 'PNG', margin, y, logoWidth, logoHeight);
    y += logoHeight + 20;

    // 2. Título y Nº de Orden
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(data.title, margin, y);
    y += 20;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(data.orderNumber, margin, y);
    y += 25;

    // 3. Detalles del Trabajo
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(data.jobDetailsTitle, margin, y);
    y += 15;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text([data.dimensions, data.quantity, data.paper, data.sheet, data.printing, data.finishes], margin, y);
    y += 6 * 15 + 10;

    // 4. Desglose de Costos
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(data.costBreakdownTitle, margin, y);
    y += 15;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text([data.itemsPerSheet, data.sheetsWithWaste, data.paperCost, data.plateCost, data.printCost, data.finishingCost], margin, y);
    y += 6 * 15 + 10;
    
    // 5. Línea divisoria
    doc.setDrawColor(200);
    doc.line(margin, y, 572, y);
    y += 20;
    
    // 6. Resumen Total
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
    y += 30;

    // 7. Visualización de Imposición
    if (visualizerElement) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Visualización de Imposición', margin, y);
        y += 15;

        const canvas = await html2canvas(visualizerElement, { scale: 3, backgroundColor: '#ffffff' });
        const imgData = canvas.toDataURL('image/png');
        
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * margin;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        if (y + pdfHeight > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            y = margin;
        }

        doc.addImage(imgData, 'PNG', margin, y, pdfWidth, pdfHeight);
    }
    
    doc.save(`cotizacion_${formState.productionOrderNumber}.pdf`);
};
