import React, { useState } from 'react';
import { Plus, X, MapPin, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Route, Destination } from '../types';

interface RouteFormProps {
  onSave: (route: Route) => void;
  onCancel: () => void;
  editingRoute?: Route;
}

export const RouteForm: React.FC<RouteFormProps> = ({ onSave, onCancel, editingRoute }) => {
  const { drivers, vehicles } = useApp();
  const [formData, setFormData] = useState<Partial<Route>>({
    driverId: editingRoute?.driverId || '',
    driverName: editingRoute?.driverName || '',
    vehicleId: editingRoute?.vehicleId || '',
    vehiclePlate: editingRoute?.vehiclePlate || '',
    departureCity: editingRoute?.departureCity || '',
    departureTime: editingRoute?.departureTime || '',
    destinations: editingRoute?.destinations || [{ id: '1', city: '', time: '', observation: '' }]
  });

  const handleDriverChange = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    setFormData({
      ...formData,
      driverId,
      driverName: driver?.name || ''
    });
  };

  const handleVehicleChange = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    setFormData({
      ...formData,
      vehicleId,
      vehiclePlate: vehicle?.plate || ''
    });
  };

  const addDestination = () => {
    if (formData.destinations && formData.destinations.length < 5) {
      setFormData({
        ...formData,
        destinations: [
          ...formData.destinations,
          { id: Date.now().toString(), city: '', time: '', observation: '' }
        ]
      });
    }
  };

  const removeDestination = (id: string) => {
    if (formData.destinations && formData.destinations.length > 1) {
      setFormData({
        ...formData,
        destinations: formData.destinations.filter(dest => dest.id !== id)
      });
    }
  };

  const updateDestination = (id: string, field: keyof Destination, value: string) => {
    if (formData.destinations) {
      setFormData({
        ...formData,
        destinations: formData.destinations.map(dest =>
          dest.id === id ? { ...dest, [field]: value } : dest
        )
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.driverId && formData.vehicleId && formData.departureCity && formData.departureTime) {
      const route: Route = {
        id: editingRoute?.id || Date.now().toString(),
        driverId: formData.driverId,
        driverName: formData.driverName!,
        vehicleId: formData.vehicleId,
        vehiclePlate: formData.vehiclePlate!,
        departureCity: formData.departureCity,
        departureTime: formData.departureTime,
        destinations: formData.destinations!.filter(dest => dest.city.trim() !== '')
      };
      onSave(route);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        {editingRoute ? 'Editar Roteiro' : 'Novo Roteiro'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Motorista *
            </label>
            <select
              value={formData.driverId}
              onChange={(e) => handleDriverChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Selecione o motorista</option>
              {drivers.map(driver => (
                <option key={driver.id} value={driver.id}>{driver.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Veículo *
            </label>
            <select
              value={formData.vehicleId}
              onChange={(e) => handleVehicleChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Selecione o veículo</option>
              {vehicles.map(vehicle => (
                <option key={vehicle.id} value={vehicle.id}>{vehicle.plate}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cidade de Partida *
            </label>
            <input
              type="text"
              value={formData.departureCity}
              onChange={(e) => setFormData({ ...formData, departureCity: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Horário de Partida *
            </label>
            <input
              type="time"
              value={formData.departureTime}
              onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Destinos
            </label>
            <button
              type="button"
              onClick={addDestination}
              disabled={formData.destinations?.length === 5}
              className="text-orange-600 hover:text-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Adicionar Destino</span>
            </button>
          </div>

          {formData.destinations?.map((destination, index) => (
            <div key={destination.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Destino {index + 1}</span>
                </h4>
                {formData.destinations!.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDestination(destination.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    value={destination.city}
                    onChange={(e) => updateDestination(destination.id, 'city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Horário
                  </label>
                  <input
                    type="time"
                    value={destination.time}
                    onChange={(e) => updateDestination(destination.id, 'time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Observação
                </label>
                <textarea
                  value={destination.observation}
                  onChange={(e) => updateDestination(destination.id, 'observation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  rows={2}
                  placeholder="Ex: Retirar documentos, Apenas entrega"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            {editingRoute ? 'Atualizar' : 'Adicionar'} Roteiro
          </button>
        </div>
      </form>
    </div>
  );
};