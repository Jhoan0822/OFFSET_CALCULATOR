// src/utils/textGenerator.ts

import type { QuoteDetails, FormState } from '../types';
import { PAPER_SIZES, PAPER_TYPES, FINISHES_CONFIG, PRINT_PRESETS } from '../constants';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
};

export const generateQuoteTextData = (quote: QuoteDetails, formState: FormState) => {
    const selectedPaper = PAPER_SIZES[formState.selectedPaperIndex];
    const paperTypeInfo = PAPER_TYPES[formState.paperType as keyof typeof PAPER_TYPES];
    
    const printDetails = formState.printMode === 'preset'
        ? PRINT_PRESETS[formState.printPreset].name
        : `${formState.customFrontInks}x${formState.customBackInks} (Personalizado)`;
    
    const activeFinishes = Object.keys(formState.finishes)
        .filter(key => formState.finishes[key].enabled)
        .map(key => FINISHES_CONFIG[key]?.name)
        .filter(Boolean)
        .join(', ');

    return {
        title: "Cotización de Impresión Offset",
        orderNumber: `Nº de Orden: ${formState.productionOrderNumber}`,
        
        jobDetailsTitle: "Detalles del Trabajo",
        dimensions: `Dimensiones: ${formState.jobWidth}cm x ${formState.jobHeight}cm`,
        quantity: `Cantidad: ${formState.quantity.toLocaleString('es-CO')} unidades`,
        paper: `Papel: ${paperTypeInfo.name} ${formState.paperWeight}gr`,
        sheet: `Formato Pliego: ${selectedPaper.name} (${selectedPaper.width}x${selectedPaper.height}cm)`,
        printing: `Impresión: ${printDetails}`,
        finishes: `Acabados: ${activeFinishes || 'Ninguno'}`,

        costBreakdownTitle: "Desglose de Costos",
        itemsPerSheet: `Cabida por Pliego: ${quote.itemsPerSheet} unidades`,
        sheetsWithWaste: `Pliegos con Desperdicio: ${quote.sheetsWithWaste.toLocaleString('es-CO')}`,
        paperCost: `Costo de Papel: ${formatCurrency(quote.paperCost)}`,
        plateCost: `Costo de Placas (${quote.calculatedPlates} un.): ${formatCurrency(quote.plateCost)}`,
        printCost: `Costo de Impresión: ${formatCurrency(quote.printCost)}`,
        finishingCost: `Costo de Acabados: ${formatCurrency(quote.finishingCost)}`,
        
        summaryTitle: "Resumen",
        subtotal: `Subtotal: ${formatCurrency(quote.subtotal)}`,
        tax: `IVA (19%): ${formatCurrency(quote.tax)}`,
        total: `Total: ${formatCurrency(quote.total)}`,
    };
};
