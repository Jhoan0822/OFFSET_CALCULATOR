import type { PaperSize, QuoteDetails, FormState, FinishOption } from './types';

export const PAPER_SIZES: PaperSize[] = [
  { name: 'Carta (21.5 x 28 cm)', width: 21.5, height: 28 },
  { name: 'Oficio (21.5 x 34 cm)', width: 21.5, height: 34 },
  { name: 'Tabloide (28 x 43 cm)', width: 28, height: 43 },
  { name: 'Doble Carta (43 x 28 cm)', width: 43, height: 28 },
  { name: 'Pliego (60 x 90 cm)', width: 60, height: 90 },
  { name: 'Medio Pliego (60 x 45 cm)', width: 60, height: 45 },
  { name: 'Cuarto de Pliego (45 x 30 cm)', width: 45, height: 30 },
];

// --- PRECIOS CONFIGURABLES ---

export const PAPER_TYPES = {
  bond: { name: 'Bond', weights: [60, 70, 75, 80, 90] },
  couche: { name: 'Couché/Esmaltado', weights: [100, 115, 130, 150, 170, 200, 250, 300, 350] },
  opalina: { name: 'Opalina', weights: [180, 220, 250] },
  adhesivo: { name: 'Adhesivo', weights: [150] },
};

export const PAPER_COSTS: { [weight: number]: number } = {
  60: 291, 70: 326, 75: 570, 80: 400, 90: 467, 100: 500, 115: 535, 130: 650, 
  150: 700, 170: 750, 180: 800, 200: 900, 220: 950, 250: 1200, 300: 1400, 350: 1600,
};

export const PRINT_PRESETS: { [key: string]: { name: string; costPerThousand: number; plates: number } } = {
  '1x0': { name: '1x0 - 1 color / Sin impresión', costPerThousand: 8000, plates: 1 },
  '1x1': { name: '1x1 - 1 color / 1 color', costPerThousand: 12000, plates: 2 },
  '2x0': { name: '2x0 - 2 colores / Sin impresión', costPerThousand: 15000, plates: 2 },
  '2x2': { name: '2x2 - 2 colores / 2 colores', costPerThousand: 22000, plates: 4 },
  '4x0': { name: '4x0 - Full color / Sin impresión', costPerThousand: 25000, plates: 4 },
  '4x1': { name: '4x1 - Full color / 1 color', costPerThousand: 30000, plates: 5 },
  '4x4': { name: '4x4 - Full color / Full color', costPerThousand: 40000, plates: 8 },
};

// type: 'perThousand' or 'perUnit'
export const FINISHES_CONFIG: { [key: string]: { name: string; type: 'perThousand' | 'perUnit'; defaultCost: number } } = {
  cutting: { name: 'Corte', type: 'perThousand', defaultCost: 10000 },
  uvVarnish: { name: 'Barniz UV', type: 'perThousand', defaultCost: 10000 },
  uvRelief: { name: 'Relieve UV', type: 'perThousand', defaultCost: 16000 },
  matteLamination: { name: 'Plastificado Mate', type: 'perThousand', defaultCost: 12000 },
  glossLamination: { name: 'Plastificado Brillante', type: 'perThousand', defaultCost: 12000 },
  softTouchLamination: { name: 'Laminado Soft Touch', type: 'perThousand', defaultCost: 18000 },
  hotStamping: { name: 'Hot Stamping', type: 'perThousand', defaultCost: 20000 },
  embossing: { name: 'Relieve en Seco', type: 'perThousand', defaultCost: 17000 },
  dieCutting: { name: 'Troquelado', type: 'perThousand', defaultCost: 14000 },
  
  stitching: { name: 'Cosido a Hilo', type: 'perUnit', defaultCost: 1600 },
  metalRing: { name: 'Anillado Metálico', type: 'perUnit', defaultCost: 2800 },
  plasticSpiral: { name: 'Espiral Plástico', type: 'perUnit', defaultCost: 2200 },
  stapling: { name: 'Grapado', type: 'perUnit', defaultCost: 1200 },
};

// --- ESTADOS INICIALES ---

export const INITIAL_QUOTE: QuoteDetails = {
    itemsPerSheet: 0,
    bestOrientation: 'none',
    sheetsNeeded: 0,
    sheetsWithWaste: 0,
    paperCost: 0,
    plateCost: 0,
    printCost: 0,
    finishingCost: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
    calculatedPlates: 0,
};

const initialFinishes = Object.entries(FINISHES_CONFIG).reduce((acc, [key, config]) => {
  acc[key] = { enabled: false, cost: config.defaultCost };
  return acc;
}, {} as { [key: string]: FinishOption });

const initialPaperWeight = 150;

export const INITIAL_FORM_STATE: FormState = {
  productionOrderNumber: '',
  jobWidth: 9,
  jobHeight: 5,
  quantity: 1000,
  selectedPaperIndex: 2, // Tabloide
  wastePercentage: 10,
  designImage: null,
  applyTax: true,
  
  paperType: 'couche',
  paperWeight: initialPaperWeight,
  paperCostPerSheet: PAPER_COSTS[initialPaperWeight] || 0,

  printMode: 'preset',
  printPreset: '4x4',
  customFrontInks: 4,
  customBackInks: 4,

  plateCost: 20000,

  finishes: initialFinishes,
};
