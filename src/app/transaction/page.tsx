import React from 'react';
import transactionService from './transaction.service';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import { TransactionInterface } from './types/Transaction';
import AuthMiddleware from "@/components/ServerAuthProvider";

interface TransactionSearchParams {
  searchParams: {
    transactionId: string;
  };
}

const Transaction = async ({ searchParams }: TransactionSearchParams) => {
  const { transactionId } = await searchParams;

  const currentTransaction = await transactionService
    .fetchTransactionInfo(transactionId) as TransactionInterface;


  const transactionsId = await transactionService
    .fetchUserTransactions(currentTransaction.freelancerId) as TransactionInterface[];

  const transactionsList = await Promise.all(transactionsId.map((t) => {
    return transactionService.fetchTransactionInfo(t.id);
  })) as [];

  return (
    <AuthMiddleware>
      <div className='h-full'>
        <Sidebar sidebarItems={transactionsList} >
          <Chat currentGig={currentTransaction} />
        </Sidebar>
      </div>
    </AuthMiddleware>
  );
};

export default Transaction;