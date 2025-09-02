import React from 'react';
import { UserTransaction } from '../types/User';
import userProfileService from '../userProfile.service';
import { Gig } from '../types/Gig';
import Link from 'next/link';
import { queryBuilder } from '@/lib/utils';

const transLateTransaction = (stateENG: string): string => {
  const valuesES: Record<string, string> = {
    requested: "Iniciada",
    pending: "En progreso",
    success: "Finalizada correctamente",
    failure: "No completada",
    cancelled_by_freelancer: "Cancelada",
    cancelled_by_user: "Cancelada",
  };

  return valuesES[stateENG] ?? stateENG;
};


export default async function UserTransactions(
  { transactionList }:
    { transactionList: UserTransaction[] }
) {

  const transactions = await Promise.all(
    transactionList.map(async (t: UserTransaction) => {

      const gigInfo: Gig = await userProfileService.fetchGigById(t.gigId);
      const transactionQuery = queryBuilder({ transactionId: t.id });

      return (
        <div key={t.id}
          className="
          w-[95%] 
          h-fit 
          py-3 
          px-4 
          my-2 
          dark:bg-card 
          dark:border 
          rounded-lg 
          flex 
          flex-row
          justify-center 
          items-start
        "
        >
          <div className='flex flex-col'>
            <p>{gigInfo.title}</p>
            <p>Monto: {t.amount}</p>
            <p>Estado: {transLateTransaction(t.lifecycle.name)}</p>
          </div>
          <Link href={`/transaction${transactionQuery}`}>
            Detalles
          </Link>
        </div>
      );

    })
  );


  return (
    <div
      className='
        h-60
        flex
        flex-col
        items-center
        relative
        dark:bg-card
        dark:border
        mx-5
        my-2
        rounded-lg
        overflow-y-scroll
        overflow-x-hidden
    '>
      {transactions}
    </div>
  );
}
