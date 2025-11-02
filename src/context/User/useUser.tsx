import { useEffect, useReducer } from 'react';
import { reducer, initialState } from './reducer';
import { useSession } from "next-auth/react";
import { queryBuilder } from '@/lib/utils';


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const useUser = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { data: session } = useSession();

  const actions = {
    async fetchUserData() {
      if (session?.userId) {
        const res = await fetch(`${BASE_URL}/api/user/id/${session?.userId}`);
        const data = await res.json();

        delete data["rankCommunity"];
        delete data["rankPlatform"];

        dispatch({ type: 'INIT', payload: { data } });
      }
    },
    async fetchUserGigs() {
      const userId = state.userData.id;
      const userQuery = queryBuilder({ userId });
      const res = await fetch(`${BASE_URL}/api/user/gig/${userQuery}`);
      const data = await res.json();

      dispatch({ type: 'SET_USER_GIGS', payload: { data } });

    }
  };

  useEffect(() => {
    actions.fetchUserData();
  }, [session?.userId]);

  return {
    actions,
    state
  };
};

export default useUser;