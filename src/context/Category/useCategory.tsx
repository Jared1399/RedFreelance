import { useEffect, useReducer } from 'react';
import { reducer, initialState } from './reducer';


const useCategory = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = {
    async fetchCategoryList() {
      const res = await fetch("http://localhost:3000/api/category");
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