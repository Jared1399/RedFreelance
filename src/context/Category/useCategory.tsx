import { useEffect, useReducer } from 'react';
import { reducer, initialState } from './reducer';
import { queryBuilder } from "@/lib/utils";


const useCategory = ({ skip = 0, limit = 10 }: { skip?: number, limit?: number } = {}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = {
    async fetchCategoryList() {
      const categoryQuery = queryBuilder(
        {
          skip: skip,
          limit: limit
        }
      );
      const res = await fetch(`http://localhost:3000/api/category${categoryQuery}`);
      const data = await res.json();

      dispatch({ type: 'INIT', payload: { gigs: data.category } });
    }
  };

  useEffect(() => {
    actions.fetchCategoryList();
  }, []);


  return {
    actions,
    state
  };
};

export default useCategory;