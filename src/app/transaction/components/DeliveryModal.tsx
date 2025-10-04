"use client";

import React, { useEffect, useState, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TransactionContext } from '../hooks/UseTransaction/context';
import { useSession } from 'next-auth/react';
import { useChat } from '../hooks/useChat';
import transactionService from '../transaction.service';

interface DeliveryModalProps {
  freelancerId?: string
}

export default function DeliveryModal({ freelancerId }: DeliveryModalProps) {
  const { data: session } = useSession();
  const userId = session?.userId;
  const { state } = useContext(TransactionContext);
  const [openModal, setOpenModal] = useState(false);
  const {
    sendMessage,
    selectedFile,
    setSelectedFile,
  } = useChat(state.currentTransaction, userId);

  const [notes, setNotes] = useState<string>('');

  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const currTransaction = state.currentTransaction;

  useEffect(() => {
    if (!selectedFile) {
      setFilePreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setFilePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const resetForm = () => {
    setNotes('');
    setSelectedFile(null);
    setFilePreviewUrl(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) setSelectedFile(f);
  };


  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (sending) return;

    if (!currTransaction) {
      toast.error('No hay transacción seleccionada');
      return;
    }

    if (!userId) {
      toast.error('Usuario no autenticado');
      return;
    }

    if (!notes.trim() && !selectedFile) {
      toast.error('Agrega notas o un archivo para la entrega');
      return;
    }

    setSending(true);

    const metadata = {
      type: "delivery",
      freelancerId: freelancerId || currTransaction.freelancerId,
      timestamp: new Date().toISOString(),
      transactionId: currTransaction.id
    };

    const text = notes.trim() ? notes : 'Entrega del trabajo completado';

    const success = await sendMessage(text, selectedFile, metadata);

    if (success) {
      toast.success('Entrega enviada correctamente');
      resetForm();
      setOpenModal(false);
    } else {
      toast.error('Error al enviar la entrega');
    }

    transactionService.updateTransactionLifecycle("on_review", currTransaction.id);


    setSending(false);
  };

  const handleCloseModal = () => {
    resetForm();
    setOpenModal(false);
  };
  if (!openModal) {
    return (
      <div
        className="
          bg-neutral-300 
          outline 
          px-4 
          py-2 
          mx-2 
          rounded-lg 
          cursor-pointer 
          hover:bg-neutral-400 
          transition-colors
          "
        role="button"
        aria-label="Hacer entrega"
        onClick={() => setOpenModal(true)}
      >
        📦
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-70"
        onClick={handleCloseModal}
      />

      <div className="
        relative 
        bg-white 
        dark:bg-gray-800 
        rounded-lg 
        w-full 
        max-w-2xl 
        mx-4 
        p-6 
        z-10
      ">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Enviar entrega
          </h3>
          <button
            onClick={handleCloseModal}
            className="
              text-gray-500 
              hover:text-gray-700 
              dark:text-gray-400 
              dark:hover:text-gray-200 
              text-2xl 
              font-bold
              ">
            x
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notas de entrega {!selectedFile && '(obligatorias si no hay archivo)'}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="
                w-full 
                border 
                border-gray-300 
                dark:border-gray-600 
                rounded-lg 
                px-3 
                py-2 
                focus:outline-none 
                focus:ring-2 
                focus:ring-blue-500 
                dark:bg-gray-700 
                dark:text-white
              "
              rows={4}
              placeholder="Describe tu entrega, incluye instrucciones o detalles importantes..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Archivo adjunto {!notes.trim() && '(obligatorio si no hay notas)'}
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="
                w-full 
                border 
                border-gray-300 
                dark:border-gray-600 
                rounded-lg 
                px-3 
                py-2 
                focus:outline-none 
                focus:ring-2 
                focus:ring-blue-500 
                dark:bg-gray-700 
                dark:text-white 
                file:mr-4 
                file:py-2 
                file:px-4 
                file:rounded-full 
                file:border-0 
                file:text-sm 
                file:font-semibold 
                file:bg-blue-50 
                file:text-blue-700 
                hover:file:bg-blue-100
                "/>

            {filePreviewUrl && selectedFile && (
              <div className="mt-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vista previa:
                </p>
                {selectedFile.type.startsWith('image/') ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={filePreviewUrl}
                      alt="Preview"
                      className="max-h-48 rounded-lg border"
                    />
                    <p className="text-sm text-gray-500 mt-2">{selectedFile.name}</p>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">📄</div>
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="
                px-6 
                py-2 
                border 
                border-gray-300 
                dark:border-gray-600 
                rounded-lg 
                text-gray-700 
                dark:text-gray-300 
                hover:bg-gray-50 
                dark:hover:bg-gray-700 
                transition-colors
              "
              disabled={sending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={sending || (!notes.trim() && !selectedFile)}
              className="
                px-6 
                py-2 
                bg-blue-600 
                text-white 
                rounded-lg 
                hover:bg-blue-700 
                disabled:opacity-50 
                disabled:cursor-not-allowed 
                transition-colors
              "
              onClick={handleSubmit}
            >
              {sending ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2">
                  </div>
                  Enviando...
                </span>
              ) : (
                'Enviar entrega'
              )}
            </button>
          </div>
        </div>
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
}