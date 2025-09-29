import formatDateES from '@/lib/timeago';
import React, { useContext, useEffect, useState } from 'react';
import { TransactionContext } from '../hooks/UseTransaction/context';

export default function TimeOutBanner() {
  const { state } = useContext(TransactionContext);

  const date = state.currentTransaction?.expirationDate;
  const today = new Date();
  const expiration = date ? new Date(date) : new Date();

  const [showModal, setShowModal] = useState(true);
  const [isExpired, setIsExpired] = useState(today > expiration);

  useEffect(() => {
    setIsExpired(today > expiration);
  }, [date, today, expiration]);

  const formattedDate = date ? formatDateES(date.toString()) : '';

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
              {
                isExpired ?
                  (<>Esta conversación ya no está disponible</>)
                  :
                  (<>
                    Esta conversación está disponible hasta dentro de {formattedDate}
                  </>)
              }
            </p>
          </div>
        )
      }
    </>
  );
}