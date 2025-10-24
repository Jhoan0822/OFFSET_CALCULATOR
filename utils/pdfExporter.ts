import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { QuoteDetails, FormState } from '../types';
import { PAPER_SIZES, PAPER_TYPES, PRINT_PRESETS, FINISHES_CONFIG } from '../constants';

export const exportToPDF = async (
    quote: QuoteDetails, 
    formState: FormState,
    visualizerElement: HTMLElement | null
) => {
    if (!visualizerElement) return;

    const doc = new jsPDF('p', 'pt', 'letter');
    const margin = 40;
    let y = margin;

    const addText = (text: string, size: number, isBold: boolean = false) => {
        doc.setFontSize(size);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        doc.text(text, margin, y);
        y += size * 1.2;
    };
    
    const addKeyValue = (key: string, value: string) => {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(key, margin, y);
        doc.setFont('helvetica', 'normal');
        
        // Wrap text if value is too long
        const splitValue = doc.splitTextToSize(value, 350); // 350 is the max width for the value
        doc.text(splitValue, margin + 200, y);
        y += 15 * splitValue.length;
    };
    
    const formatCurrency = (value: number) => {
        const formatter = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0,
        });
        return formatter.format(value);
    };

    const selectedPaper = PAPER_SIZES[formState.selectedPaperIndex];
    const paperDetails = `${PAPER_TYPES[formState.paperType as keyof typeof PAPER_TYPES].name} ${formState.paperWeight}gr`;
    const printDetails = formState.printMode === 'preset'
        ? PRINT_PRESETS[formState.printPreset].name
        : `${formState.customFrontInks}x${formState.customBackInks} (Personalizado)`;

    const activeFinishes = Object.entries(formState.finishes)
        .filter(([, finish]) => finish.enabled)
        .map(([key]) => FINISHES_CONFIG[key]?.name)
        .filter(Boolean)
        .join(', ');


    addText('Cotización de Impresión Offset', 22, true);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nº de Orden: ${formState.productionOrderNumber}`, margin, y);
    y += 20;

    addText('Detalles del Trabajo', 14, true);
    y+= 5;
    addKeyValue('Dimensiones:', `${formState.jobWidth}cm x ${formState.jobHeight}cm`);
    addKeyValue('Cantidad:', `${formState.quantity.toLocaleString('es-CO')} unidades`);
    addKeyValue('Pliego:', selectedPaper.name);
    addKeyValue('Material:', paperDetails);
    addKeyValue('Impresión:', printDetails);
    addKeyValue('Acabados:', activeFinishes || 'Ninguno');
    y += 15;

    addText('Desglose de Costos', 14, true);
    y+= 5;
    addKeyValue('Cabida por Pliego:', `${quote.itemsPerSheet} unidades`);
    addKeyValue('Pliegos con Desperdicio:', `${quote.sheetsWithWaste.toLocaleString('es-CO')}`);
    y += 5;
    addKeyValue('Costo de Papel:', formatCurrency(quote.paperCost));
    addKeyValue(`Costo de Placas (${quote.calculatedPlates} un.):`, formatCurrency(quote.plateCost));
    addKeyValue('Costo de Impresión:', formatCurrency(quote.printCost));
    addKeyValue('Costo de Acabados:', formatCurrency(quote.finishingCost));
    doc.line(margin, y, 572, y);
    y+=10;

    addKeyValue('Subtotal:', formatCurrency(quote.subtotal));
    if(formState.applyTax) {
       addKeyValue('IVA (19%):', formatCurrency(quote.tax));
    }
    y+=5;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', margin, y);
    doc.text(formatCurrency(quote.total), margin + 200, y);
    y += 30;

    addText('Visualización de Imposición', 14, true);
    y += 10;

    const canvas = await html2canvas(visualizerElement, { scale: 2, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    
    const imgProps = doc.getImageProperties(imgData);
    const pdfWidth = doc.internal.pageSize.getWidth() - 2 * margin;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    if (y + pdfHeight > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
    }

    doc.addImage(imgData, 'PNG', margin, y, pdfWidth, pdfHeight);

    doc.save(`cotizacion-${formState.productionOrderNumber}.pdf`);
};