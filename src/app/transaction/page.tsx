'use client';

import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import AuthMiddleware from "@/components/ClientAuthMiddleware";
import useTransaction from './hooks/UseTransaction';
import { useSession } from 'next-auth/react';
import { useSearchParams } from "next/navigation";
import { TransactionContext } from './hooks/UseTransaction/context';
import { Suspense, useState, useEffect } from 'react';
import transactionService from './transaction.service';
import HandlePaymentModal from './components/HandlePaymentModal';

const TransactionContent = () => {

  const searchParams = useSearchParams();
  const transactionId = searchParams?.get("transactionId");
  const paymentStatus = searchParams?.get("payment_status");
  const paymentId = searchParams?.get("p_id");

  const { data: session, status } = useSession();
  const { state, actions } = useTransaction({
    transactionId: transactionId ?? undefined,
    userId: session?.userId ?? undefined
  });
  const [paymentOk, setPaymentOk] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!transactionId || !paymentStatus || !paymentId) return;

    const verify = async () => {
      try {
        const res = await transactionService.findPaymentById(transactionId, paymentId);
        if (!res.ok) return;
        const verifiedPayment = await res.json();
        if (!cancelled && verifiedPayment?.transaction?.id) {
          setPaymentOk(true);
        }
      } catch (e) {
        console.error('Error verificando pago:', e);
      }

    };

    verify();
    return () => { cancelled = true; };
  }, [transactionId, paymentStatus, paymentId]);


  if (!session?.userId) {
    return <div>Loading...</div>;
  }

  return (
    <AuthMiddleware status={status}>
      <TransactionContext.Provider value={{ state, actions }}>
        {
          paymentStatus &&
          <HandlePaymentModal
            paymentOk={paymentOk}
            transactionId={transactionId || ''}
          />}
        <div className='h-full'>
          <Sidebar sidebarItems={state.userTransactions as []}>
            <Chat />
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