import React, { useState } from 'react';
import { MessageSquare, Copy, Edit2, Send, CheckCircle } from 'lucide-react';
import { DailyProgram } from '../types';

interface MessagePreviewProps {
  program: DailyProgram;
  onMessageUpdate: (message: string) => void;
  onSend: (method: 'web' | 'app' | 'copy') => void;
}

export const MessagePreview: React.FC<MessagePreviewProps> = ({ program, onMessageUpdate, onSend }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(program.message);
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    onMessageUpdate(editedMessage);
    setIsEditing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(program.message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onSend('copy');
  };

  const handleWhatsAppWeb = () => {
    const encodedMessage = encodeURIComponent(program.message);
    window.open(`https://web.whatsapp.com/send?text=${encodedMessage}`, '_blank');
    onSend('web');
  };

  const handleWhatsAppApp = () => {
    const encodedMessage = encodeURIComponent(program.message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    onSend('app');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-orange-600" />
          <span>Pré-visualização da Mensagem</span>
        </h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-orange-600 hover:text-orange-700 flex items-center space-x-1"
        >
          <Edit2 className="h-4 w-4" />
          <span>{isEditing ? 'Cancelar' : 'Editar'}</span>
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <textarea
            value={editedMessage}
            onChange={(e) => setEditedMessage(e.target.value)}
            className="w-full h-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
          />
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-white font-mono">
              {program.message}
            </pre>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleWhatsAppWeb}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
            >
              <Send className="h-4 w-4" />
              <span>WhatsApp Web</span>
            </button>

            <button
              onClick={handleWhatsAppApp}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
            >
              <Send className="h-4 w-4" />
              <span>WhatsApp App</span>
            </button>

            <button
              onClick={handleCopy}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
            >
              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Copiado!' : 'Copiar Mensagem'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};