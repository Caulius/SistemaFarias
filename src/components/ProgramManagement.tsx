import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, Clock, Truck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RouteForm } from './RouteForm';
import { MessagePreview } from './MessagePreview';
import { DailyProgram, Route } from '../types';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const ProgramManagement: React.FC = () => {
  const { programs, addProgram, updateProgram, deleteProgram } = useApp();
  const [activeProgram, setActiveProgram] = useState<DailyProgram | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRouteForm, setShowRouteForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [programDate, setProgramDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [programSequence, setProgramSequence] = useState(1);

  const generateMessage = (program: DailyProgram): string => {
    let message = `📌 **PROGRAMAÇÃO DIÁRIA ${program.sequence}**\n\n`;

    program.routes.forEach((route, index) => {
      message += `🚚 **VEÍCULO ${index + 1}** - ${route.vehiclePlate}\n`;
      message += `👤 Motorista: ${route.driverName}\n`;
      message += `📍 Partida: ${route.departureCity} às ${route.departureTime}\n`;

      route.destinations.forEach((dest, destIndex) => {
        message += `🛣️ Destino ${destIndex + 1}: ${dest.city}`;
        if (dest.time) message += ` às ${dest.time}`;
        message += '\n';
        if (dest.observation) {
          message += `📝 Obs: ${dest.observation}\n`;
        }
      });

      message += '\n';
    });

    return message.trim();
  };

  const createNewProgram = async () => {
    const existingPrograms = programs.filter(p => p.date === programDate);
    const nextSequence = existingPrograms.length + 1;
    
    const newProgram: DailyProgram = {
      id: Date.now().toString(),
      date: programDate,
      sequence: nextSequence,
      routes: [],
      message: '',
      createdAt: new Date()
    };

    try {
      setLoading(true);
      const id = await addProgram(newProgram);
      const programWithId = { ...newProgram, id };
      setActiveProgram(programWithId);
      setProgramSequence(nextSequence);
    } catch (error) {
      alert('Erro ao criar programação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const addRouteToProgram = async (route: Route) => {
    if (activeProgram) {
      const updatedRoutes = editingRoute
        ? activeProgram.routes.map(r => r.id === editingRoute.id ? route : r)
        : [...activeProgram.routes, route];

      const updatedProgram = {
        ...activeProgram,
        routes: updatedRoutes,
        message: generateMessage({ ...activeProgram, routes: updatedRoutes })
      };

      try {
        await updateProgram(activeProgram.id, updatedProgram);
        setActiveProgram(updatedProgram);
      } catch (error) {
        alert('Erro ao salvar roteiro. Tente novamente.');
      }
    }
    setShowRouteForm(false);
    setEditingRoute(null);
  };

  const removeRouteFromProgram = async (routeId: string) => {
    if (activeProgram) {
      const updatedRoutes = activeProgram.routes.filter(r => r.id !== routeId);
      const updatedProgram = {
        ...activeProgram,
        routes: updatedRoutes,
        message: generateMessage({ ...activeProgram, routes: updatedRoutes })
      };

      try {
        await updateProgram(activeProgram.id, updatedProgram);
        setActiveProgram(updatedProgram);
      } catch (error) {
        alert('Erro ao remover roteiro. Tente novamente.');
      }
    }
  };

  const handleMessageUpdate = async (message: string) => {
    if (activeProgram) {
      const updatedProgram = { ...activeProgram, message };
      try {
        await updateProgram(activeProgram.id, updatedProgram);
        setActiveProgram(updatedProgram);
      } catch (error) {
        alert('Erro ao atualizar mensagem. Tente novamente.');
      }
    }
  };

  const handleDeleteProgram = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta programação?')) {
      return;
    }

    try {
      setLoading(true);
      
      // Atualizar UI imediatamente para melhor UX
      if (activeProgram?.id === id) {
        setActiveProgram(null);
      }
      
      // Executar exclusão no Firebase
      await deleteProgram(id);
      
    } catch (error) {
      console.error('Erro ao excluir programação:', error);
      alert('Erro ao excluir programação. Tente novamente.');
      
      // Recarregar dados em caso de erro para sincronizar
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (method: 'web' | 'app' | 'copy') => {
    console.log(`Enviando via ${method}`);
    // Aqui você pode implementar analytics ou outras funcionalidades
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Programações Diárias</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            <input
              type="date"
              value={programDate}
              onChange={(e) => setProgramDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            onClick={createNewProgram}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>{loading ? 'Criando...' : 'Nova Programação'}</span>
          </button>
        </div>
      </div>

      {activeProgram && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Programação Diária {activeProgram.sequence} - {format(parseISO(activeProgram.date), 'dd/MM/yyyy', { locale: ptBR })}
            </h3>
            
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600 dark:text-gray-400">
                {activeProgram.routes.length} roteiro(s) adicionado(s)
              </p>
              <button
                onClick={() => setShowRouteForm(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
                disabled={activeProgram.routes.length >= 30}
              >
                <Plus className="h-4 w-4" />
                <span>Adicionar Roteiro</span>
              </button>
            </div>

            {activeProgram.routes.length > 0 && (
              <div className="space-y-3">
                {activeProgram.routes.map((route, index) => (
                  <div key={route.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Truck className="h-5 w-5 text-orange-600" />
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Veículo {index + 1} - {route.vehiclePlate}
                        </h4>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingRoute(route);
                            setShowRouteForm(true);
                          }}
                          className="text-orange-600 hover:text-orange-700"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeRouteFromProgram(route.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <p>👤 Motorista: {route.driverName}</p>
                      <p>📍 Partida: {route.departureCity} às {route.departureTime}</p>
                      <p>🛣️ Destinos: {route.destinations.map(d => d.city).join(', ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {showRouteForm && (
            <RouteForm
              onSave={addRouteToProgram}
              onCancel={() => {
                setShowRouteForm(false);
                setEditingRoute(null);
              }}
              editingRoute={editingRoute || undefined}
            />
          )}

          {activeProgram.routes.length > 0 && (
            <MessagePreview
              program={activeProgram}
              onMessageUpdate={handleMessageUpdate}
              onSend={handleSend}
            />
          )}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {programs.map((program) => (
          <div key={program.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Programação {program.sequence}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveProgram(program)}
                  className="text-orange-600 hover:text-orange-700"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteProgram(program.id)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{format(parseISO(program.date), 'dd/MM/yyyy', { locale: ptBR })}</span>
              </p>
              <p className="flex items-center space-x-1">
                <Truck className="h-4 w-4" />
                <span>{program.routes.length} roteiro(s)</span>
              </p>
              <p className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{format(new Date(program.createdAt), 'HH:mm', { locale: ptBR })}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {programs.length === 0 && !activeProgram && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Nenhuma programação criada</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Crie sua primeira programação diária</p>
        </div>
      )}
    </div>
  );
};
