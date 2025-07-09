export interface Driver {
  id: string;
  name: string;
  phone?: string;
  createdAt: Date;
}

export interface Vehicle {
  id: string;
  plate: string;
  model?: string;
  createdAt: Date;
}

export interface Destination {
  id: string;
  city: string;
  time?: string;
  observation?: string;
}

export interface Route {
  id: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  vehiclePlate: string;
  departureCity: string;
  departureTime: string;
  destinations: Destination[];
}

export interface DailyProgram {
  id: string;
  date: string;
  sequence: number;
  routes: Route[];
  createdAt: Date;
  message: string;
}

export type Theme = 'light' | 'dark';