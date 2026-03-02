import React, { useContext, useState } from 'react';
import { TransactionContext } from '../hooks/UseTransaction/context';

async function handlePayClick(transactionId: string) {
  if (!transactionId) return;

  const res = await fetch("/api/payments/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      transactionId: transactionId,
    }),
  });

  const data = await res.json();

  openWebpayForm(data.url, data.token);
}

function openWebpayForm(url: string, token: string) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = url;

  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "token_ws";
  input.value = token;

  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
}


export default function PaymentButton({ transactionId }: { transactionId: string }) {
  const { state } = useContext(TransactionContext);

  const currTransaction = state.currentTransaction;
  const amount = currTransaction?.amount || 0;
  const commissionRate = currTransaction?.amount ?? 0;

  const commisionedAmount = (amount) * (1 + commissionRate);
  const price = commisionedAmount.toString().split('.')[0];

  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(!openModal);
  };

  return openModal ? (

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
        <div className="absolute top-3 right-3">
          <div className="relative group">
            <button
              type="button"
              aria-label="Información">
              <span
                className="
                  h-8 
                  w-8 
                  rounded-full 
                  border-2 
                  color-background 
                  flex 
                  items-center 
                  justify-center 
                  text-neutral-800
                ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10A8 8 0 11-2 10a8 8 0 0020 0zm-9-3a1 1 0 112 0 1 1 0 01-2 0zm1 
                    4a1 1 0 00-1 1v2a1 1 0 102 0v-2a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </button>

            <div
              className="
                absolute 
                top-full 
                right-0 
                mt-2 
                w-40 
                bg-black 
                text-white 
                text-xs 
                rounded 
                py-2 
                px-3 
                opacity-0 
                group-hover:opacity-100 
                transition-opacity
                select-none
              ">
              Precio base: {currTransaction?.amount.toString()} <br />
              % Comision: {currTransaction?.commissionRate}%
            </div>
          </div>
        </div>

        <div
          className="
            mx-auto 
            flex 
            items-center 
            justify-center 
            h-16 
            w-16 
            rounded-full 
            bg-yellow-100 
            mb-5">
          <svg
            className="h-8 w-8 text-yellow-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3
               3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Pagar CLP {price}
        </h3>
        <p className="text-background opacity-50 text-sm mb-6">
          ¿Deseas proceder con el pago de esta transacción?
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleCloseModal}
            className="flex-1 
            py-3 
            rounded-lg 
            border 
            border-gray-300 
            bg-transparent 
            text-background 
            cursor-pointer
          ">
            Cancelar
          </button>

          <button
            onClick={() => handlePayClick(transactionId)}
            className="flex-1 py-3 rounded-lg bg-background text-foreground cursor-pointer"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>

  ) : (
    <button
      className="
          bg-ring
          absolute 
          right-15 
          top-1 
          border-2
          border-accent-foreground 
          px-3 
          py-1 
          rounded-lg
          cursor-pointer
          hover:bg-accent
          md:top-2
          md:py-2
        "
      onClick={handleCloseModal}
    >

      Pagar
    </button>
  );
}
