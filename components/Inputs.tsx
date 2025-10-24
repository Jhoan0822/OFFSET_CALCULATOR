import React from 'react';

interface InputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: number;
}

const baseInputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none";

export const NumberInput: React.FC<InputProps> = ({ label, value, onChange, min = 0, step = 1 }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = e.target.valueAsNumber;
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        step={step}
        className={baseInputClasses}
      />
    </div>
  );
};


interface SelectProps {
    label: string;
    value: number | string;
    onChange: (value: number | string) => void;
    children: React.ReactNode;
    stringValue?: boolean;
}

export const SelectInput: React.FC<SelectProps> = ({ label, value, onChange, children, stringValue = false }) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(stringValue ? e.target.value : Number(e.target.value));
    };

    return (
        <div>
            <label className="block text-sm font-medium text-slate-700">{label}</label>
            <select
                value={value}
                onChange={handleChange}
                className={baseInputClasses}
            >
                {children}
            </select>
        </div>
    );
}

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const CheckboxInput: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className="flex items-center">
      <input
        id={label}
        name={label}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
      />
      <label htmlFor={label} className="ml-3 block text-sm font-medium text-slate-700 select-none">
        {label}
      </label>
    </div>
  );
};
