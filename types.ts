export interface PaperSize {
  name: string;
  width: number; // in cm
  height: number; // in cm
}

export interface QuoteDetails {
  itemsPerSheet: number;
  bestOrientation: 'normal' | 'rotated' | 'none';
  sheetsNeeded: number;
  sheetsWithWaste: number;
  paperCost: number;
  plateCost: number;
  printCost: number;
  finishingCost: number;
  subtotal: number;
  tax: number;
  total: number;
  calculatedPlates: number;
}

export interface FinishOption {
  enabled: boolean;
  cost: number;
}

export interface FormState {
  productionOrderNumber: string;
  jobWidth: number;
  jobHeight: number;
  quantity: number;
  selectedPaperIndex: number;
  wastePercentage: number;
  designImage: string | null;
  applyTax: boolean;

  // New detailed pricing structure
  paperType: string;
  paperWeight: number;
  paperCostPerSheet: number;

  printMode: 'preset' | 'custom';
  printPreset: string;
  customFrontInks: number;
  customBackInks: number;
  
  plateCost: number;

  finishes: {
    [key: string]: FinishOption;
  };
}
