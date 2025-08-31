import { useReducer } from 'react';
import { reducer, initialState } from './reducer';
import { queryBuilder } from '@/lib/utils';


const useGigSearch = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = {
    async searchGigs(search: string) {
      const searchQuery = queryBuilder({ title: search, user: false });
      const fetchCategories = await fetch(`/api/gig/search${searchQuery}`);

      const searchResults = await fetchCategories.json();

      dispatch({ type: "SEARCH_GIGS", payload: { searchResults } });
    }
  };

  return {
    actions,
    state
  };
};

export default useGigSearch;