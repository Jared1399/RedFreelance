import formatDateES from '@/lib/timeago';
import React, { useState } from 'react';

export default function TimeOutBanner({ date }: { date?: Date }) {
  const [showModal, setShowModal] = useState(true);

  return (
    <>
      <div
        className='absolute top-3 right-5 text-2xl font-normal select-none cursor-pointer'
        onClick={() => setShowModal(!showModal)}
      >
        {`🛈`}
      </div>
      {
        showModal && (
          <div
            className="absolute top-14 inset-x-0 flex justify-center bg-neutral-700/50 py-2 z-10"
          >
            <p className="font-normal">
              Esta conversacion esta disponible hasta dentro de {formatDateES(date ?? "")}
            </p>
          </div>
        )
      }
    </>
  );
}