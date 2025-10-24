import React, { useState } from 'react';

interface TabsProps {
  tabNames: string[];
  children: React.ReactNode[];
}

export const Tabs: React.FC<TabsProps> = ({ tabNames, children }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {tabNames.map((name, index) => (
            <button
              key={name}
              onClick={() => setActiveTab(index)}
              className={`${
                activeTab === index
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`}
            >
              {name}
            </button>
          ))}
        </nav>
      </div>
      <div>
        {children.map((child, index) => (
           activeTab === index && <div key={index}>{child}</div>
        ))}
      </div>
    </div>
  );
};

interface TabPanelProps {
    children: React.ReactNode;
}

export const TabPanel: React.FC<TabPanelProps> = ({ children }) => {
    return <div className="py-4">{children}</div>;
};
