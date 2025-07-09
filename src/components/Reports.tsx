import React, { useState } from 'react';
import { Download, FileText, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as XLSX from 'xlsx';

export const Reports: React.FC = () => {
  const { programs } = useApp();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));

  const exportDailyReport = () => {
    const dailyPrograms = programs.filter(p => p.date === selectedDate);
    
    if (dailyPrograms.length === 0) {
      alert('Nenhuma programação encontrada para esta data');
      return;
    }

    const data: any[] = [];
    
    dailyPrograms.forEach(program => {
      program.routes.forEach((route, routeIndex) => {
        route.destinations.forEach((destination, destIndex) => {
          data.push({
            'Data': format(new Date(program.date), 'dd/MM/yyyy'),
            'Programação': program.sequence,
            'Veículo': route.vehiclePlate,
            'Motorista': route.driverName,
            'Partida': route.departureCity,
            'Horário Partida': route.departureTime,
            'Destino': destination.city,
            'Horário Destino': destination.time || '',
            'Observação': destination.observation || '',
            'Ordem Destino': destIndex + 1,
            'Ordem Veículo': routeIndex + 1
          });
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Programações Diárias');
    
    const fileName = `programacoes_${format(new Date(selectedDate), 'dd-MM-yyyy')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const exportMonthlyReport = () => {
    const monthStart = startOfMonth(new Date(selectedMonth + '-01'));
    const monthEnd = endOfMonth(monthStart);
    
    const monthlyPrograms = programs.filter(p => {
      const programDate = new Date(p.date);
      return isWithinInterval(programDate, { start: monthStart, end: monthEnd });
    });

    if (monthlyPrograms.length === 0) {
      alert('Nenhuma programação encontrada para este mês');
      return;
    }

    const data: any[] = [];
    
    monthlyPrograms.forEach(program => {
      program.routes.forEach((route, routeIndex) => {
        route.destinations.forEach((destination, destIndex) => {
          data.push({
            'Data': format(new Date(program.date), 'dd/MM/yyyy'),
            'Programação': program.sequence,
            'Veículo': route.vehiclePlate,
            'Motorista': route.driverName,
            'Partida': route.departureCity,
            'Horário Partida': route.departureTime,
            'Destino': destination.city,
            'Horário Destino': destination.time || '',
            'Observação': destination.observation || '',
            'Ordem Destino': destIndex + 1,
            'Ordem Veículo': routeIndex + 1
          });
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Programações Mensais');
    
    const fileName = `programacoes_${format(monthStart, 'MM-yyyy')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const getDailyStats = () => {
    const dailyPrograms = programs.filter(p => p.date === selectedDate);
    const totalPrograms = dailyPrograms.length;
    const totalRoutes = dailyPrograms.reduce((sum, p) => sum + p.routes.length, 0);
    const totalDestinations = dailyPrograms.reduce((sum, p) => 
      sum + p.routes.reduce((routeSum, r) => routeSum + r.destinations.length, 0), 0
    );

    return { totalPrograms, totalRoutes, totalDestinations };
  };

  const getMonthlyStats = () => {
    const monthStart = startOfMonth(new Date(selectedMonth + '-01'));
    const monthEnd = endOfMonth(monthStart);
    
    const monthlyPrograms = programs.filter(p => {
      const programDate = new Date(p.date);
      return isWithinInterval(programDate, { start: monthStart, end: monthEnd });
    });

    const totalPrograms = monthlyPrograms.length;
    const totalRoutes = monthlyPrograms.reduce((sum, p) => sum + p.routes.length, 0);
    const totalDestinations = monthlyPrograms.reduce((sum, p) => 
      sum + p.routes.reduce((routeSum, r) => routeSum + r.destinations.length, 0), 0
    );

    return { totalPrograms, totalRoutes, totalDestinations };
  };

  const dailyStats = getDailyStats();
  const monthlyStats = getMonthlyStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Relatórios</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Relatório Diário */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            <span>Relatório Diário</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Estatísticas do Dia</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-orange-600">{dailyStats.totalPrograms}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Programações</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">{dailyStats.totalRoutes}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Roteiros</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">{dailyStats.totalDestinations}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Destinos</p>
                </div>
              </div>
            </div>

            <button
              onClick={exportDailyReport}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <Download className="h-5 w-5" />
              <span>Exportar Excel Diário</span>
            </button>
          </div>
        </div>

        {/* Relatório Mensal */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center space-x-2">
            <FileText className="h-5 w-5 text-orange-600" />
            <span>Relatório Mensal</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mês
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Estatísticas do Mês</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-orange-600">{monthlyStats.totalPrograms}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Programações</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">{monthlyStats.totalRoutes}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Roteiros</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">{monthlyStats.totalDestinations}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Destinos</p>
                </div>
              </div>
            </div>

            <button
              onClick={exportMonthlyReport}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <Download className="h-5 w-5" />
              <span>Exportar Excel Mensal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
