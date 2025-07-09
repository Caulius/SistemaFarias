import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <Loader2 className="h-12 w-12 text-orange-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Carregando dados...</p>
      </div>
    </div>
  );
};