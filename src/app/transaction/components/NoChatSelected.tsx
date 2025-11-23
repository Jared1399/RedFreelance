import React from 'react';

export default function NoChatSelected() {
  return (
    <div
      className="
        flex 
        flex-col 
        items-center 
        justify-center 
        h-dvh 
        md:h-screen 
        w-full 
        bg-background 
        border 
        border-border 
        rounded-none 
        md:rounded-lg 
        p-8
        text-center
      "
    >
      <div className="bg-accent/20 p-6 rounded-full mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-12 h-12 text-accent-foreground/80"
        >
          <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
          <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
        </svg>
      </div>

      <h3 className="text-2xl font-semibold text-foreground mb-2">
        Ninguna transacción seleccionada
      </h3>

      <p className="text-muted-foreground max-w-md text-sm md:text-base">
        Selecciona una de tus transacciones del menú lateral para ver el
        historial del chat, gestionar entregas y realizar pagos.
      </p>
    </div>
  );
}