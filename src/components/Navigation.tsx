import React from 'react';
import { Users, Car, Route, FileText } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'routes', label: 'Programações', icon: Route },
    { id: 'drivers', label: 'Motoristas', icon: Users },
    { id: 'vehicles', label: 'Veículos', icon: Car },
    { id: 'reports', label: 'Relatórios', icon: FileText }
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex space-x-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex items-center space-x-2 px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === id
                  ? 'text-orange-600 border-orange-600'
                  : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-orange-600 hover:border-orange-300'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};