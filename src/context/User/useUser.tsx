import { useEffect, useReducer } from 'react';
import { reducer, initialState } from './reducer';


const useUser = (email: string) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = {
    async fetchGigList() {
      if (email) {
        const res = await fetch(`http://localhost:3000/api/user/email/${email}`);
        const data = await res.json();

        delete data["passwordHash"];
        delete data["rankCommunity"];
        delete data["rankPlatform"];

        dispatch({ type: 'INIT', payload: { data } });
      }
    }
  };

  useEffect(() => {
    actions.fetchGigList();
  }, [email]);


  return {
    actions,
    state
  };
};

export default useUser;