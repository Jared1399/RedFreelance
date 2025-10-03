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
        <div
          key={t.id}
          className="
          w-full
          md:w-[95%]
          py-3
          px-4
          my-2
          dark:bg-card
          dark:border
          rounded-lg
          flex
          flex-col
          md:flex-row
          justify-between
          items-start
          gap-4
        "
        >
          <div className="flex flex-col flex-1 space-y-1 overflow-hidden">
            <p className="font-semibold text-white truncate">{gigInfo.title}</p>
            <p className="text-sm text-gray-300">
              Monto: {t.amount}
            </p>
            <p className="text-sm text-gray-300">
              Estado: {transLateTransaction(t.lifecycle.name)}
            </p>
          </div>

          <Link
            href={`/transaction${transactionQuery}`}
            className="
              mt-2
              md:mt-0
              text-sm
              font-medium
              text-white
              underline
              hover:text-amber-600
              whitespace-nowrap
            "
          >
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
