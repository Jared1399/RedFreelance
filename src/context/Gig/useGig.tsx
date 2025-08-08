import { useEffect, useReducer } from 'react';
import { reducer, initialState } from './reducer';
import { queryBuilder } from "@/lib/utils";


const useGig = ({ skip = 0, limit = 0 }: { skip: number, limit: number }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = {
    async fetchGigList() {

      const gigQuery = queryBuilder(
        {
          skip: skip,
          limit: limit
        }
      );

      const res = await fetch(`http://localhost:3000/api/gig${gigQuery}`);
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