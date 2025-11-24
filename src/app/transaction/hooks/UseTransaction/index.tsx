import { useEffect, useReducer } from 'react';
import { reducer, initialState } from './reducer';
import { TransactionInterface } from '../../types/Transaction';
import transactionService from '../../transaction.service';


const useTransaction = ({ transactionId, userId }: { transactionId?: string, userId?: string }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = {
    async setCurrentTransaction(transactionId: string) {
      if (transactionId == state.currentTransaction?.id) return;

      const currentTransaction = await transactionService
        .fetchTransactionInfo(transactionId) as TransactionInterface;

      dispatch({ type: 'SET_CURRENT_TRANSACTION', payload: { transaction: currentTransaction } });
    },
    async fetchUserTransactionsList(userId: string) {
      const userTransactions = await transactionService
        .fetchUserTransactions(userId) as TransactionInterface[];

      dispatch({ type: 'SET_USER_TRANSACTIONS', payload: { userTransactions } });
    },
    async updateTransactionLifeCycle(nextState: string) {
      if (!state.currentTransaction?.id) return;

      const { updatedTransaction } = await transactionService.updateTransactionLifecycle(
        nextState,
        state.currentTransaction.id,
        state.currentTransaction.tier.deliveryTime
      );

      const newLifecycle = await transactionService.fetchLifecycleInfo(nextState);

      dispatch(
        {
          type: 'UPDATE_TRANSACTION_LIFECYCLE',
          payload: { updatedTransaction, newLifecycle }
        }
      );
    },
    async handleDeliveryLocal() {
      const deliveredLifecycle = await transactionService.fetchLifecycleInfo('on_review');

      dispatch({
        type: 'HANDLE_DELIVERY_LOCALLY',
        payload: {
          lifecycle: deliveredLifecycle,
        }
      });
    },
    async handleExpDateLocal(newDate: Date) {
      dispatch({
        type: 'UPDATE_EXPIRATION_LOCAL',
        payload: { newDate }
      });
    }
  };

  useEffect(() => {
    if (transactionId) {
      actions.setCurrentTransaction(transactionId);
    }
    if (userId) {
      actions.fetchUserTransactionsList(userId);
    }
  }, [transactionId, userId]);

  return {
    actions,
    state
  };
};

export default useTransaction;