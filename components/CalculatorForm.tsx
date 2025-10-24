import React from 'react';
import type { FormState, FinishOption } from '../types';
import { PAPER_SIZES, PAPER_TYPES, PAPER_COSTS, PRINT_PRESETS, FINISHES_CONFIG } from '../constants';
import { Card } from './Card';
import { NumberInput, SelectInput, CheckboxInput } from './Inputs';
import { ImageInput } from './ImageInput';
import { Tabs, TabPanel } from './Tabs';

interface CalculatorFormProps {
  formState: FormState;
  onFormChange: (field: keyof FormState, value: any) => void;
  onFinishChange: (finishKey: string, value: Partial<FinishOption>) => void;
  onRegenerateOrderNumber: () => void;
  calculatedPlates: number;
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">{children}</h3>
);

const formatNumber = (num: number) => new Intl.NumberFormat('es-CO').format(num);

export const CalculatorForm: React.FC<CalculatorFormProps> = ({ formState, onFormChange, onFinishChange, onRegenerateOrderNumber, calculatedPlates }) => {
  const availableWeights = PAPER_TYPES[formState.paperType as keyof typeof PAPER_TYPES]?.weights || [];

  const handlePaperTypeChange = (value: string) => {
    onFormChange('paperType', value);
    const firstWeight = PAPER_TYPES[value as keyof typeof PAPER_TYPES]?.weights[0];
    if (firstWeight) {
      onFormChange('paperWeight', firstWeight);
      onFormChange('paperCostPerSheet', PAPER_COSTS[firstWeight] || 0);
    }
  };
  
  const handleWeightChange = (value: number) => {
    onFormChange('paperWeight', value);
    onFormChange('paperCostPerSheet', PAPER_COSTS[value] || 0);
  };

  return (
    <div className="space-y-6">
      <Card>
         <div className="flex justify-between items-center mb-6 bg-slate-50 p-3 rounded-md border border-slate-200">
            <div>
                <label className="block text-sm font-medium text-slate-700">Nº de Orden</label>
                <p className="text-lg font-mono text-slate-900 tracking-wider" aria-live="polite">{formState.productionOrderNumber}</p>
            </div>
            <button
                type="button"
                onClick={onRegenerateOrderNumber}
                title="Generar nuevo número de orden"
                className="p-2 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V4a1 1 0 011-1zm10 8a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 111.885-.666A5.002 5.002 0 0014.001 13H11a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
        <SectionTitle>1. Detalles del Trabajo</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NumberInput label="Ancho (cm)" value={formState.jobWidth} onChange={(val) => onFormChange('jobWidth', val)} min={0.1} step={0.1}/>
          <NumberInput label="Alto (cm)" value={formState.jobHeight} onChange={(val) => onFormChange('jobHeight', val)} min={0.1} step={0.1}/>
          <NumberInput label="Cantidad" value={formState.quantity} onChange={(val) => onFormChange('quantity', val)} min={1} />
        </div>
         <div className="mt-6">
            <ImageInput label="Diseño (Opcional)" previewImage={formState.designImage} onChange={(val) => onFormChange('designImage', val)} />
        </div>
      </Card>

      <Card>
        <SectionTitle>2. Material e Impresión</SectionTitle>
        <Tabs tabNames={["Papel", "Impresión", "Planchas"]}>
            <TabPanel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                     <SelectInput label="Formato de Pliego" value={formState.selectedPaperIndex} onChange={(val) => onFormChange('selectedPaperIndex', val)}>
                        {PAPER_SIZES.map((paper, index) => (<option key={paper.name} value={index}>{paper.name}</option>))}
                    </SelectInput>
                    <NumberInput label="Desperdicio (%)" value={formState.wastePercentage} onChange={(val) => onFormChange('wastePercentage', val)} min={0}/>
                    <SelectInput label="Tipo de Papel" value={formState.paperType} onChange={(val) => handlePaperTypeChange(String(val))} stringValue={true}>
                        {Object.entries(PAPER_TYPES).map(([key, { name }]) => (<option key={key} value={key}>{name}</option>))}
                    </SelectInput>
                    <SelectInput label="Gramaje (gr)" value={formState.paperWeight} onChange={(val) => handleWeightChange(Number(val))}>
                        {availableWeights.map(weight => (<option key={weight} value={weight}>{weight} gr</option>))}
                    </SelectInput>
                     <div className="sm:col-span-2">
                        <NumberInput label="Costo por Pliego (COP)" value={formState.paperCostPerSheet} onChange={(val) => onFormChange('paperCostPerSheet', val)} min={0} step={10}/>
                    </div>
                </div>
            </TabPanel>
            <TabPanel>
                <div className="space-y-4 mt-4">
                    <div className="flex items-center gap-6">
                        <label className="flex items-center">
                            <input type="radio" name="printMode" value="preset" checked={formState.printMode === 'preset'} onChange={() => onFormChange('printMode', 'preset')} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"/>
                            <span className="ml-2 text-sm font-medium text-slate-700">Usar Preset</span>
                        </label>
                        <label className="flex items-center">
                             <input type="radio" name="printMode" value="custom" checked={formState.printMode === 'custom'} onChange={() => onFormChange('printMode', 'custom')} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"/>
                            <span className="ml-2 text-sm font-medium text-slate-700">Personalizado</span>
                        </label>
                    </div>
                    {formState.printMode === 'preset' ? (
                        <SelectInput label="Tipo de Impresión" value={formState.printPreset} onChange={(val) => onFormChange('printPreset', String(val))} stringValue={true}>
                            {Object.entries(PRINT_PRESETS).map(([key, { name }]) => (<option key={key} value={key}>{name}</option>))}
                        </SelectInput>
                    ) : (
                         <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-md border">
                            <NumberInput label="Tintas Frente" value={formState.customFrontInks} onChange={(v) => onFormChange('customFrontInks', v)} min={0} />
                            <NumberInput label="Tintas Reverso" value={formState.customBackInks} onChange={(v) => onFormChange('customBackInks', v)} min={0} />
                        </div>
                    )}
                </div>
            </TabPanel>
            <TabPanel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <NumberInput label="Costo por Plancha (COP)" value={formState.plateCost} onChange={(v) => onFormChange('plateCost', v)} min={0} step={1000} />
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Planchas Calculadas</label>
                        <div className="mt-1 block w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md text-sm shadow-sm">
                            {calculatedPlates}
                        </div>
                    </div>
                </div>
            </TabPanel>
        </Tabs>
      </Card>
      
      <Card>
          <SectionTitle>3. Acabados</SectionTitle>
            <div className="space-y-4">
                <div>
                    <h4 className="text-sm font-semibold text-slate-600 mb-2">Acabados de Impresión (por Millar)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(FINISHES_CONFIG)
                        .filter(([, config]) => config.type === 'perThousand')
                        .map(([key, { name, defaultCost }]) => (
                             <div key={key} className="p-3 border rounded-lg space-y-2 bg-slate-50/50">
                                <CheckboxInput
                                    label={`${name} (+${formatNumber(defaultCost)})`}
                                    checked={formState.finishes[key]?.enabled || false}
                                    onChange={(checked) => onFinishChange(key, { enabled: checked })}
                                />
                                {formState.finishes[key]?.enabled && (
                                    <NumberInput 
                                        label="Costo Final"
                                        value={formState.finishes[key].cost}
                                        onChange={(cost) => onFinishChange(key, { cost })}
                                        min={0}
                                        step={100}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                 <div>
                    <h4 className="text-sm font-semibold text-slate-600 mt-6 mb-2">Acabados Finales (por Unidad)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(FINISHES_CONFIG)
                        .filter(([, config]) => config.type === 'perUnit')
                        .map(([key, { name, defaultCost }]) => (
                            <div key={key} className="p-3 border rounded-lg space-y-2 bg-slate-50/50">
                                <CheckboxInput
                                    label={`${name} (+${formatNumber(defaultCost)})`}
                                    checked={formState.finishes[key]?.enabled || false}
                                    onChange={(checked) => onFinishChange(key, { enabled: checked })}
                                />
                                {formState.finishes[key]?.enabled && (
                                    <NumberInput 
                                        label="Costo Final"
                                        value={formState.finishes[key].cost}
                                        onChange={(cost) => onFinishChange(key, { cost })}
                                        min={0}
                                        step={100}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
      </Card>

       <Card>
          <SectionTitle>4. Impuestos</SectionTitle>
           <CheckboxInput label="Aplica IVA (19%)" checked={formState.applyTax} onChange={(val) => onFormChange('applyTax', val)} />
      </Card>
    </div>
  );
};
