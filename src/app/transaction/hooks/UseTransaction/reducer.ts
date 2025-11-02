import { TransactionInterface } from "../../types/Transaction";
import { disabledStatus, disabledByDate } from "./utils";

interface Action {
  type: string;
  // eslint-disable-next-line
  payload: { [key: string]: any };
}

type InitialState = {
  userTransactions: TransactionInterface[];
  currentTransaction: TransactionInterface | undefined;
};

const initialState: InitialState = {
  userTransactions: [],
  currentTransaction: {} as TransactionInterface
};


const reducer = (state: InitialState = initialState, action: Action): InitialState => {
  const actions: { [key: string]: () => InitialState } = {
    SET_CURRENT_TRANSACTION: () => {
      const transaction = action.payload.transaction as TransactionInterface;

      return {
        ...state,
        currentTransaction: {
          ...transaction,
          disabledChat:
            disabledStatus(transaction?.lifecycle) || disabledByDate(transaction?.expirationDate)
        }
      };
    },
    SET_USER_TRANSACTIONS: () => {
      return {
        ...state,
        userTransactions: action.payload.userTransactions as TransactionInterface[]
      };
    },
    UPDATE_TRANSACTION_LIFECYCLE: () => {
      return {
        ...state,
        currentTransaction: {
          ...(state.currentTransaction || {}),
          ...(action.payload.updatedTransaction || {}),
          lifecycleId: action.payload.updatedTransaction.lifecycleId,
          lifecycle: action.payload.newLifecycle
        } as TransactionInterface
      };
    },
    HANDLE_DELIVERY_LOCALLY: () => {
      return {
        ...state,
        currentTransaction: {
          ...state.currentTransaction,
          lifecycle: action.payload.lifecycle,
          lifecycleId: action.payload.lifecycle.id
        } as TransactionInterface
      };
    }
  };

  const fn = actions[action.type];
  return fn ? fn() : state;
};

export { initialState, reducer }; 