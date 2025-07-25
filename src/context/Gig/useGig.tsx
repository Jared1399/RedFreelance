//here you handle all complex logic related to transformation 
//and data transform
import { useReducer } from 'react';
import { reducer, initialState } from './reducer';


const useGig = () => {
  const [state, dispatch] = useReducer(reducer, initialState);


  const actions = {
    async fetchGigList() {
      console.info(state.gigList);
      dispatch({ type: 'INIT', payload: { lol: true } })
    }
  }

  return {
    actions,
    state
  }
}

export default useGig;