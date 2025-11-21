import { useReducer } from 'react';
import { reducer, initialState } from './reducer';
import { queryBuilder } from "@/lib/utils";
import { authFetch } from "@/lib/authFetch";


const useGig = (
  {
    limit = 10,
    skip = 0,
    category,
  }:
    {
      limit?: number,
      skip?: number,
      category?: string
    } = {}
) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = {
    async fetchGigList() {
      const gigQuery = queryBuilder(
        {
          skip: skip,
          limit: limit
        }
      );

      const res = await authFetch(`/api/gig${gigQuery}`);
      const data = await res.json();

      dispatch({ type: 'SET_GIG_LIST', payload: { gigs: data.gigs } });
    },
    async fetchCategoryInfo() {
      const fetchCategory = await authFetch(`/api/category/name/${category}`);
      const categoryInfo = await fetchCategory.json();

      dispatch({ type: 'SET_CATEGORY_INFO', payload: { categoryInfo } });

      return categoryInfo;
    },
    async fetchGigsByCategory() {
      const categoryInfo = await actions.fetchCategoryInfo();
      const fetchGigs = await authFetch(`/api/gig/category/${categoryInfo.id}`);

      const data = await fetchGigs.json();

      dispatch({ type: 'SET_GIG_LIST', payload: { gigs: data } });
    },
    async fetchGigById(gigId: string, userId: string) {
      const gigQuery = queryBuilder({ gigId, userId });

      const fetchGigInfo = await authFetch(`/api/gig${gigQuery}`);

      const data = await fetchGigInfo.json();

      dispatch({ type: 'SET_GIG_INFO', payload: { gig: data.gigDetails } });
      return data.gigDetails;
    }
  };

  return {
    actions,
    state
  };
};

export default useGig;