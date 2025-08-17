import { useReducer } from 'react';
import { reducer, initialState } from './reducer';
import { queryBuilder } from "@/lib/utils";


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

      const res = await fetch(`http://localhost:3000/api/gig${gigQuery}`);
      const data = await res.json();

      dispatch({ type: 'SET_GIG_LIST', payload: { gigs: data.gigs } });
    },
    async fetchCategoryInfo() {
      const fetchCategory = await fetch(`http://localhost:3000/api/category/name/${category}`);
      const categoryInfo = await fetchCategory.json();

      dispatch({ type: 'SET_CATEGORY_INFO', payload: { categoryInfo } });

      return categoryInfo;
    },
    async fetchGigsByCategory() {
      const categoryInfo = await actions.fetchCategoryInfo();
      const fetchGigs = await fetch(`http://localhost:3000/api/gig/category/${categoryInfo.id}`);

      const data = await fetchGigs.json();

      dispatch({ type: 'SET_GIG_LIST', payload: { gigs: data } });
    }
  };

  return {
    actions,
    state
  };
};

export default useGig;