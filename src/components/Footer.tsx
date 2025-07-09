import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-8">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p className="text-sm">
            Desenvolvido por <span className="font-semibold text-orange-600">Carlos Freitas</span> • © 2025
          </p>
        </div>
      </div>
    </footer>
  );
};