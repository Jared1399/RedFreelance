//here you handle all complex logic related to transformation 
//and data transform
import { useEffect, useReducer } from 'react';
import { reducer, initialState } from './reducer';


const useGig = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = {
    async fetchGigList() {
      const res = await fetch("http://localhost:3000/api/gig");
      const data = await res.json();

      dispatch({ type: 'INIT', payload: { gigs: data.gigs } });
    }
  };

  useEffect(() => {
    actions.fetchGigList();
  }, []);


  return {
    actions,
    state
  };
};

export default useGig;