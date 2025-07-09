import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, Driver, Vehicle, DailyProgram } from '../types';
import {
  addDriverToFirestore,
  getDriversFromFirestore,
  deleteDriverFromFirestore,
  addVehicleToFirestore,
  getVehiclesFromFirestore,
  deleteVehicleFromFirestore,
  addProgramToFirestore,
  getProgramsFromFirestore,
  updateProgramInFirestore,
  deleteProgramFromFirestore
} from '../services/firebaseService';

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  drivers: Driver[];
  vehicles: Vehicle[];
  programs: DailyProgram[];
  loading: boolean;
  addDriver: (driver: Omit<Driver, 'id' | 'createdAt'>) => Promise<void>;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => Promise<void>;
  addProgram: (program: Omit<DailyProgram, 'id' | 'createdAt'>) => Promise<string>;
  updateProgram: (id: string, updates: Partial<DailyProgram>) => Promise<void>;
  deleteDriver: (id: string) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  deleteProgram: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [programs, setPrograms] = useState<DailyProgram[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from Firebase on app start
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [driversData, vehiclesData, programsData] = await Promise.all([
          getDriversFromFirestore(),
          getVehiclesFromFirestore(),
          getProgramsFromFirestore()
        ]);
        
        setDrivers(driversData);
        setVehicles(vehiclesData);
        setPrograms(programsData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Driver operations
  const addDriver = async (driverData: Omit<Driver, 'id' | 'createdAt'>) => {
    try {
      const id = await addDriverToFirestore(driverData);
      const newDriver: Driver = {
        ...driverData,
        id,
        createdAt: new Date()
      };
      setDrivers(prev => [newDriver, ...prev]);
    } catch (error) {
      console.error('Erro ao adicionar motorista:', error);
      throw error;
    }
  };

  const deleteDriver = async (id: string) => {
    try {
      await deleteDriverFromFirestore(id);
      setDrivers(prev => prev.filter(driver => driver.id !== id));
    } catch (error) {
      console.error('Erro ao deletar motorista:', error);
      throw error;
    }
  };

  // Vehicle operations
  const addVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'createdAt'>) => {
    try {
      const id = await addVehicleToFirestore(vehicleData);
      const newVehicle: Vehicle = {
        ...vehicleData,
        id,
        createdAt: new Date()
      };
      setVehicles(prev => [newVehicle, ...prev]);
    } catch (error) {
      console.error('Erro ao adicionar veículo:', error);
      throw error;
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      await deleteVehicleFromFirestore(id);
      setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
    } catch (error) {
      console.error('Erro ao deletar veículo:', error);
      throw error;
    }
  };

  // Program operations
  const addProgram = async (programData: Omit<DailyProgram, 'id' | 'createdAt'>): Promise<string> => {
    try {
      const id = await addProgramToFirestore(programData);
      const newProgram: DailyProgram = {
        ...programData,
        id,
        createdAt: new Date()
      };
      setPrograms(prev => [newProgram, ...prev]);
      return id;
    } catch (error) {
      console.error('Erro ao adicionar programação:', error);
      throw error;
    }
  };

  const updateProgram = async (id: string, updates: Partial<DailyProgram>) => {
    try {
      await updateProgramInFirestore(id, updates);
      setPrograms(prev => prev.map(program => 
        program.id === id ? { ...program, ...updates } : program
      ));
    } catch (error) {
      console.error('Erro ao atualizar programação:', error);
      throw error;
    }
  };

  const deleteProgram = async (id: string) => {
    try {
      await deleteProgramFromFirestore(id);
      setPrograms(prev => prev.filter(program => program.id !== id));
    } catch (error) {
      console.error('Erro ao deletar programação:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      drivers,
      vehicles,
      programs,
      loading,
      addDriver,
      addVehicle,
      addProgram,
      updateProgram,
      deleteDriver,
      deleteVehicle,
      deleteProgram
    }}>
      {children}
    </AppContext.Provider>
  );
};