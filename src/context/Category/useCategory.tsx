import { useReducer, useCallback } from 'react';
import { reducer, initialState } from './reducer';
import { queryBuilder } from "@/lib/utils";

interface Category {
  id?: string;
  name: string;
  description: string;
  userId: string;
  created_at: Date;
  updated_at: Date;
}


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
    fetchCategoryList,
    async searchCategories(search: string) {
      const searchQuery = queryBuilder({ name: search });
      const fetchCategories = await fetch(`/api/category/search${searchQuery}`);

      const searchResults = await fetchCategories.json();

      dispatch({ type: "SEARCH_CATEGORIES", payload: { searchResults } });
    },
    addCategory(newCategory: Category) {
      dispatch({ type: "ADD_CATEGORY", payload: { newCategory } });
    }
  };

  return {
    actions,
    state
  };
};

export default useCategory;