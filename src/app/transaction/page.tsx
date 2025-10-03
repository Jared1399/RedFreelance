'use client';

import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import AuthMiddleware from "@/components/ClientAuthMiddleware";
import useTransaction from './hooks/UseTransaction';
import { useSession } from 'next-auth/react';
import { useSearchParams } from "next/navigation";
import { TransactionContext } from './hooks/UseTransaction/context';
import { Suspense } from 'react';

const TransactionContent = () => {
  const searchParams = useSearchParams();
  const transactionId = searchParams?.get("transactionId");
  const { data: session, status } = useSession();
  const { state, actions } = useTransaction({
    transactionId: transactionId ?? undefined,
    userId: session?.userId ?? undefined
  });

  if (!session?.userId) {
    return <div>Loading...</div>;
  }

  const transaction = transactionId ? state.currentTransaction : state.userTransactions[0];

  return (
    <AuthMiddleware status={status}>
      <TransactionContext.Provider value={{ state, actions }}>
        <div className='h-full'>
          <Sidebar sidebarItems={state.userTransactions as []}>
            {transaction && <Chat />}
          </Sidebar>
        </div>
      </TransactionContext.Provider>
    </AuthMiddleware>
  );
};

const Transaction = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <TransactionContent />
  </Suspense>
);

export default Transaction;