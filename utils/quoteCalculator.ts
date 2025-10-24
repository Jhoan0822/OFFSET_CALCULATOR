import type { FormState, QuoteDetails } from '../types';
import { PAPER_SIZES, INITIAL_QUOTE, PRINT_PRESETS, FINISHES_CONFIG } from '../constants';

export const calculateQuote = (formState: FormState): QuoteDetails => {
  const { 
    jobWidth, jobHeight, quantity, selectedPaperIndex,
    wastePercentage, applyTax, paperCostPerSheet,
    printMode, printPreset, customFrontInks, customBackInks,
    plateCost, finishes
  } = formState;

  if (!jobWidth || !jobHeight || !quantity) {
    return INITIAL_QUOTE;
  }

  const selectedPaper = PAPER_SIZES[selectedPaperIndex];
  if (!selectedPaper) {
    return INITIAL_QUOTE;
  }

  const { width: sheetW, height: sheetH } = selectedPaper;
  
  if ((jobWidth > sheetW || jobHeight > sheetH) && (jobWidth > sheetH || jobHeight > sheetW)) {
     return { ...INITIAL_QUOTE, bestOrientation: 'none' };
  }

  const fitNormal = Math.floor(sheetW / jobWidth) * Math.floor(sheetH / jobHeight);
  const fitRotated = Math.floor(sheetW / jobHeight) * Math.floor(sheetH / jobWidth);

  const itemsPerSheet = Math.max(fitNormal, fitRotated);
  
  if (itemsPerSheet === 0) {
    return { ...INITIAL_QUOTE, bestOrientation: 'none' };
  }

  const bestOrientation = fitNormal >= fitRotated ? 'normal' : 'rotated';
  
  const sheetsNeeded = Math.ceil(quantity / itemsPerSheet);
  const sheetsWithWaste = Math.ceil(sheetsNeeded * (1 + wastePercentage / 100));

  // --- NEW DETAILED COST CALCULATION ---

  // 1. Paper Cost
  const totalPaperCost = sheetsWithWaste * paperCostPerSheet;
  
  // 2. Plate Cost
  let calculatedPlates = 0;
  if (printMode === 'preset') {
    calculatedPlates = PRINT_PRESETS[printPreset]?.plates || 0;
  } else {
    calculatedPlates = customFrontInks + customBackInks;
  }
  const totalPlateCost = calculatedPlates * plateCost;

  // 3. Print Cost
  let totalPrintCost = 0;
  if (printMode === 'preset') {
      const presetCost = PRINT_PRESETS[printPreset]?.costPerThousand || 0;
      totalPrintCost = Math.ceil(sheetsWithWaste / 1000) * presetCost;
  } else {
    // Fallback or custom logic could be implemented here. For now, let's use a base rate.
    const baseRatePerThousandPerInk = 5000;
    totalPrintCost = Math.ceil(sheetsWithWaste / 1000) * (customFrontInks + customBackInks) * baseRatePerThousandPerInk;
  }
  
  // 4. Finishing Cost
  let totalFinishingCost = 0;
  for (const key in finishes) {
    if (finishes[key].enabled) {
      const config = FINISHES_CONFIG[key as keyof typeof FINISHES_CONFIG];
      const finishData = finishes[key];
      if (config) {
        if (config.type === 'perThousand') {
          // Corrected calculation: Charge per "thousand of items or fraction"
          totalFinishingCost += Math.ceil(quantity / 1000) * finishData.cost;
        } else if (config.type === 'perUnit') {
          totalFinishingCost += finishData.cost * quantity;
        }
      }
    }
  }

  // --- TOTALS ---
  const subtotal = totalPaperCost + totalPlateCost + totalPrintCost + totalFinishingCost;
  const tax = applyTax ? subtotal * 0.19 : 0;
  const total = subtotal + tax;

  return {
    itemsPerSheet,
    bestOrientation,
    sheetsNeeded,
    sheetsWithWaste,
    paperCost: totalPaperCost,
    plateCost: totalPlateCost,
    printCost: totalPrintCost,
    finishingCost: totalFinishingCost,
    subtotal,
    tax,
    total,
    calculatedPlates,
  };
};