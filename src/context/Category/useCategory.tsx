import { useEffect, useReducer, useCallback } from 'react';
import { reducer, initialState } from './reducer';
import { queryBuilder } from "@/lib/utils";


const useCategory = ({ skip = 0, limit = 10 }: { skip?: number, limit?: number } = {}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchCategoryList = useCallback(async () => {
    try {
      const categoryQuery = queryBuilder({ skip, limit });
      const res = await fetch(`/api/category${categoryQuery}`, {
        cache: "force-cache"
      });

      if (!res.ok) throw new Error("Error fetching categories");

      const data = await res.json();
      dispatch({ type: "INIT", payload: { gigs: data.category } });
    } catch (error) {
      console.error(error);
    }
  }, [skip, limit]);


  const actions = {
    fetchCategoryList
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