import React from 'react';
import { UserTransaction } from '../types/User';
import userProfileService from '../userProfile.service';
import { Gig } from '../types/Gig';

export default async function UserTransactions(
  { transactionList }:
    { transactionList: UserTransaction[] }
) {

  const transactions = await Promise.all(
    transactionList.map(async (t: UserTransaction) => {
      const gigInfo: Gig = await userProfileService.fetchGigById(t.gigId);

      return (
        <div key={t.id} className="border-b p-2 h-20">
          <p>{gigInfo.title}</p>
          <p>Monto: {t.amount}</p>
          <p>Estado: {t.lifecycle.name}</p>
        </div>
      );

    })
  );



  return (
    <div className='h-full w-full overflow-y-scroll '>
      {transactions}

    </div>
  );
}
