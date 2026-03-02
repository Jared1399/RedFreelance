"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function HandlePaymentModal(
  { paymentOk, transactionId }:
    { paymentOk: boolean, transactionId: string }
) {
  const router = useRouter();

  const [openModal, setOpenModal] = useState(true);

  const handleCloseModal = () => {
    setOpenModal(!openModal);
    router.push(`/transaction?transactionId=${transactionId}`);
  };

  const modalTitle = paymentOk ? "¡Pago Exitoso!" : "Error";

  const paymentLabel = paymentOk ?
    'Tu pago se ha procesado correctamente.' :
    'Se ha producido un error procesando el pago, por favor intenta nuevamente';

  return openModal && (
    <div
      className="
        fixed 
        inset-0 
        flex 
        items-center 
        justify-center 
        z-100 
        bg-black/70 
        bg-opacity-70
      "
      onClick={handleCloseModal}
    >
      <div
        className="absolute inset-0 "
        onClick={handleCloseModal}
      />
      <div
        className="bg-white rounded-xl shadow-2xl p-6 pt-10 w-[90%] max-w-sm text-center relative"
        onClick={(e) => e.stopPropagation()}
      >

        {paymentOk ? (<div
          className="
            mx-auto 
            flex 
            items-center 
            justify-center 
            h-16 
            w-16 
            rounded-full 
            bg-green-100 
            mb-5
          ">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2" d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        ) : (

          <div
            className="
            mx-auto 
            flex 
            items-center 
            justify-center 
            h-16 
            w-16 
            rounded-full 
            bg-red-100 
            mb-5
          ">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        )}

        <h3 className="text-xl font-bold text-gray-900 mb-2">{modalTitle}</h3>
        <p className="text-gray-500 text-sm mb-6">
          {paymentLabel}
        </p>

        <button
          onClick={handleCloseModal}
          className="
            w-full 
            bg-black 
            text-white 
            py-3 
            rounded-lg 
            font-medium 
            hover:bg-zinc-800 
            transition-colors
            cursor-pointer
          "
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
