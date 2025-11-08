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
          p-4
          my-2
          dark:bg-card
          dark:border
          rounded-lg
          flex
          flex-col
          sm:flex-row
          justify-between
          items-start
          sm:items-center
          gap-3
          sm:gap-4
        "
        >
          <div className="flex flex-col flex-1 min-w-0 space-y-2 sm:space-y-1">
            <p className="font-semibold text-white truncate text-sm sm:text-base">
              {gigInfo.title}
            </p>
            <div className="flex flex-col sm:flex-row sm:gap-4 text-xs sm:text-sm">
              <p className="text-gray-300">
                Monto: {t.amount}
              </p>
              <p className="text-gray-300">
                Estado: {transLateTransaction(t.lifecycle.name)}
              </p>
            </div>
          </div>

          <Link
            href={`/transaction${transactionQuery}`}
            className="
            text-sm
            font-medium
            text-white
            underline
            hover:text-amber-600
            transition-colors
            whitespace-nowrap
            self-end
            sm:self-auto
            mt-2
            sm:mt-0
          "
          >
            Ver detalles
          </Link>
        </div>
      );
    })
  );

  return (
    <div
      className='
      h-60
      sm:h-80
      flex
      flex-col
      relative
      dark:bg-card
      dark:border
      mx-2
      sm:mx-5
      my-2
      rounded-lg
      overflow-y-auto
      overflow-x-hidden
      p-2
      sm:p-4
  '>
      {transactions.length > 0 ? (
        transactions
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400">
          No hay transacciones
        </div>
      )}
    </div>
  );
}
