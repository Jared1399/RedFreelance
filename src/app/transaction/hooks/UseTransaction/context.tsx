import { createContext } from "react";
import { TransactionInterface } from "../../types/Transaction";

interface TransactionContextType {
  state: {
    currentTransaction?: TransactionInterface;
    userTransactions: TransactionInterface[];
  };
  actions: {
    setCurrentTransaction: (transactionId: string) => Promise<void>;
    fetchUserTransactionsList: (userId: string) => Promise<void>;
  };
}


export const TransactionContext = createContext<TransactionContextType>({
  state: {
    currentTransaction: undefined,
    userTransactions: []
  },
  actions: {
    setCurrentTransaction: async () => { },
    fetchUserTransactionsList: async () => { }
  }
});

