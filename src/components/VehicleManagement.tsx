import React, { useState } from 'react';
import { Plus, Trash2, Car } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const VehicleManagement: React.FC = () => {
  const { vehicles, addVehicle, deleteVehicle } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ plate: '', model: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.plate.trim()) {
      try {
        setLoading(true);
        await addVehicle(formData);
        setFormData({ plate: '', model: '' });
        setShowForm(false);
      } catch (error) {
        alert('Erro ao adicionar veículo. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este veículo?')) {
      try {
        setLoading(true);
        await deleteVehicle(id);
      } catch (error) {
        console.error('Erro ao excluir veículo:', error);
        alert('Erro ao excluir veículo. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Ordenar veículos alfabeticamente por placa
  const sortedVehicles = [...vehicles].sort((a, b) => 
    a.plate.localeCompare(b.plate, 'pt-BR', { sensitivity: 'base' })
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gerenciar Veículos</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Adicionar Veículo</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Novo Veículo</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Placa *
              </label>
              <input
                type="text"
                value={formData.plate}
                onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                placeholder="ABC1234"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Modelo
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                placeholder="Caminhão Mercedes"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedVehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Car className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white">{vehicle.plate}</h3>
              </div>
              <button
                onClick={() => handleDelete(vehicle.id)}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {vehicle.model && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{vehicle.model}</p>
            )}
          </div>
        ))}
      </div>

      {sortedVehicles.length === 0 && (
        <div className="text-center py-12">
          <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Nenhum veículo cadastrado</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Adicione veículos para começar a criar programações</p>
        </div>
      )}
    </div>
  );
};
