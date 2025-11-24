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
    updateTransactionLifeCycle: (nextState: string) => Promise<void>,
    handleDeliveryLocal: () => Promise<void>,
    handleExpDateLocal: (newDate: Date) => void;
  };
}


export const TransactionContext = createContext<TransactionContextType>({
  state: {
    currentTransaction: undefined,
    userTransactions: []
  },
  actions: {
    setCurrentTransaction: async () => { },
    fetchUserTransactionsList: async () => { },
    updateTransactionLifeCycle: async () => { },
    handleDeliveryLocal: async () => { },
    handleExpDateLocal: async () => { }
  }
});

