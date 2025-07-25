import { useEffect, useReducer } from 'react';
import { reducer, initialState } from './reducer';
import { useSession } from "next-auth/react";


const useUser = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { data: session } = useSession();
  const userMail = session?.user?.email ?? '';

  const actions = {
    async fetchGigList() {
      if (userMail) {
        const res = await fetch(`http://localhost:3000/api/user/email/${userMail}`);
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
  }, [userMail]);


  return {
    actions,
    state
  };
};

export default useUser;