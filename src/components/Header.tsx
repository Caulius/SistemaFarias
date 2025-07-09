import React from 'react';
import { Moon, Sun, Truck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useApp();

  return (
    <header className="bg-orange-600 dark:bg-orange-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Truck className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Roteiros Logísticos</h1>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-orange-700 dark:bg-orange-600 hover:bg-orange-800 dark:hover:bg-orange-500 transition-colors"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};