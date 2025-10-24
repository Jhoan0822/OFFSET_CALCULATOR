// src/App.tsx

import React, { useState, useMemo } from 'react';
import type { FormState, FinishOption } from './types';
import { INITIAL_FORM_STATE } from './constants';
import { calculateQuote } from './utils/quoteCalculator';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { generateOrderNumber } from './utils/generateOrderNumber';

// Importa el logo
import logoSrc from '/cotizadorbanner.png';

const App: React.FC = () => {
  const [formState, setFormState] = useState<FormState>({
    ...INITIAL_FORM_STATE,
    productionOrderNumber: generateOrderNumber(),
  });
  
  const quote = useMemo(() => calculateQuote(formState), [formState]);

  const handleFormChange = (field: keyof FormState, value: any) => {
    setFormState(prevState => ({ ...prevState, [field]: value }));
  };

  const handleFinishChange = (finishKey: string, value: Partial<FinishOption>) => {
    setFormState(prevState => ({
      ...prevState,
      finishes: {
        ...prevState.finishes,
        [finishKey]: { ...prevState.finishes[finishKey], ...value },
      },
    }));
  };

  const regenerateOrderNumber = () => {
    handleFormChange('productionOrderNumber', generateOrderNumber());
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <header className="bg-white shadow-md no-print">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Cotizador de Impresión Offset
          </h1>
          <p className="text-slate-500 mt-1">Planifica y costea tus trabajos de artes gráficas.</p>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* === CAMBIO AQUÍ: Banner con tamaño ajustado y centrado === */}
        <img 
          src={logoSrc} 
          alt="Cotizador Banner" 
          className="w-full lg:w-1/2 mx-auto h-auto rounded-lg shadow-md mb-8" 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-8">
          <div className="lg:col-span-3 no-print">
            <CalculatorForm
              formState={formState}
              onFormChange={handleFormChange}
              onFinishChange={handleFinishChange}
              onRegenerateOrderNumber={regenerateOrderNumber}
              calculatedPlates={quote.calculatedPlates}
            />
          </div>
          <div className="lg:col-span-2 mt-8 lg:mt-0">
            <div className="sticky top-8">
               <ResultsDisplay quote={quote} formState={formState} />
            </div>
          </div>
        </div>
      </main>
       <footer className="text-center py-4 text-slate-500 text-sm no-print">
        <p>Creado para imprentas eficientes.</p>
      </footer>
    </div>
  );
};

export default App;
