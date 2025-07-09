import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Driver, Vehicle, DailyProgram } from '../types';

// Drivers
export const addDriverToFirestore = async (driver: Omit<Driver, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'drivers'), {
      ...driver,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar motorista:', error);
    throw error;
  }
};

export const getDriversFromFirestore = async (): Promise<Driver[]> => {
  try {
    const q = query(collection(db, 'drivers'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    })) as Driver[];
  } catch (error) {
    console.error('Erro ao buscar motoristas:', error);
    return [];
  }
};

export const deleteDriverFromFirestore = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'drivers', id));
    console.log('Motorista deletado com sucesso do Firebase');
  } catch (error) {
    console.error('Erro ao deletar motorista:', error);
    throw error;
  }
};

// Vehicles
export const addVehicleToFirestore = async (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'vehicles'), {
      ...vehicle,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar veículo:', error);
    throw error;
  }
};

export const getVehiclesFromFirestore = async (): Promise<Vehicle[]> => {
  try {
    const q = query(collection(db, 'vehicles'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    })) as Vehicle[];
  } catch (error) {
    console.error('Erro ao buscar veículos:', error);
    return [];
  }
};

export const deleteVehicleFromFirestore = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'vehicles', id));
  } catch (error) {
    console.error('Erro ao deletar veículo:', error);
    throw error;
  }
};

// Programs
export const addProgramToFirestore = async (program: Omit<DailyProgram, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'programs'), {
      ...program,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar programação:', error);
    throw error;
  }
};

export const getProgramsFromFirestore = async (): Promise<DailyProgram[]> => {
  try {
    const q = query(collection(db, 'programs'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    })) as DailyProgram[];
  } catch (error) {
    console.error('Erro ao buscar programações:', error);
    return [];
  }
};

export const updateProgramInFirestore = async (id: string, updates: Partial<DailyProgram>) => {
  try {
    await updateDoc(doc(db, 'programs', id), updates);
  } catch (error) {
    console.error('Erro ao atualizar programação:', error);
    throw error;
  }
};

export const deleteProgramFromFirestore = async (id: string) => {
  try {
    console.log('Tentando deletar programação com ID:', id);
    await deleteDoc(doc(db, 'programs', id));
    console.log('Programação deletada com sucesso do Firebase');
  } catch (error) {
    console.error('Erro ao deletar programação:', error);
    throw error;
  }
}
