import { useReducer } from 'react';
import { reducer, initialState } from './reducer';

interface Tier {
  localId: number;
  name: string;
  price: number;
  description: string;
  deliveryTime: number;
}

const useTier = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = {
    addTier(newTier: Tier) {
      dispatch({ type: 'ADD_TIER', payload: { newTier } });
    },
    removeTier(localId: number) {
      dispatch({ type: 'REMOVE_TIER', payload: { localId: localId } });
    },
    updateTier(tierToUpdate: Tier) {

      dispatch({ type: 'UPDATE_TIER', payload: { tierToUpdate } });
    }
  };

  return {
    actions,
    state
  };
};

export default useTier;