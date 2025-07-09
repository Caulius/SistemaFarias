import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ProgramManagement } from './components/ProgramManagement';
import { DriverManagement } from './components/DriverManagement';
import { VehicleManagement } from './components/VehicleManagement';
import { Reports } from './components/Reports';

const AppContent: React.FC = () => {
  const { loading } = useApp();
  const [activeTab, setActiveTab] = useState('routes');

  if (loading) {
    return <LoadingSpinner />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'routes':
        return <ProgramManagement />;
      case 'drivers':
        return <DriverManagement />;
      case 'vehicles':
        return <VehicleManagement />;
      case 'reports':
        return <Reports />;
      default:
        return <ProgramManagement />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Header />
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 container mx-auto px-4 py-8">
          {renderContent()}
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;