import React from 'react';

export default function ConfirmationModal({ handler }: { handler: (nextId: string) => void }) {
  return (
    <div className="absolute inset-x-0 bottom-25 flex justify-center bg-neutral-800/50 py-2 z-10">
      <div>
        <p>Comenzar con este trabajo?</p>
        <div className="flex flex-row w-full justify-around">
          <button
            className="bg-green-800 px-8 py-1 rounded-lg"
            onClick={() => handler("payment_pending")}
          >
            Si
          </button>
          <button
            className="bg-red-700 px-8 py-1 rounded-lg"
            onClick={() => handler("rejected_on_request")}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
