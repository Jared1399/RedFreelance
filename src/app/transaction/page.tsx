'use client';

import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import AuthMiddleware from "@/components/ClientAuthMiddleware";
import useTransaction from './hooks/UseTransaction';
import { useSession } from 'next-auth/react';
import { useSearchParams } from "next/navigation";
import { TransactionContext } from './hooks/UseTransaction/context';

const Transaction = () => {
  const searchParams = useSearchParams();
  const transactionId = searchParams?.get("transactionId");
  const { data: session, status } = useSession();

  const { state, actions } = useTransaction(
    {
      transactionId: transactionId!,
      userId: session?.userId
    }
  );

  const transaction = transactionId ? state.currentTransaction : state.userTransactions[0];

  return (
    <AuthMiddleware status={status}>
      <TransactionContext.Provider value={{ state, actions }}>
        <div className='h-full'>
          <Sidebar sidebarItems={state.userTransactions as []} >
            {transaction && (
              <Chat />
            )}
          </Sidebar>
        </div>
      </TransactionContext.Provider>
    </AuthMiddleware>
  );
};

export default Transaction;