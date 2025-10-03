import formatDateES from '@/lib/timeago';
import React, { useContext, useState } from 'react';
import { TransactionContext } from '../hooks/UseTransaction/context';

export default function TimeOutBanner() {
  const { state } = useContext(TransactionContext);
  const [showModal, setShowModal] = useState(true);

  const date = state.currentTransaction?.expirationDate;

  const formattedDate = date ? formatDateES(date.toString()) : '';
  const conversationUnavailable = state.currentTransaction?.disabledChat ?? false;

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
                conversationUnavailable ?
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