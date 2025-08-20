import { useReducer } from 'react';
import { reducer, initialState } from './reducer';
import { queryBuilder } from "@/lib/utils";


const useBlog = (
  {
    limit = 10,
    skip = 0,
    id,
  }:
    {
      limit?: number,
      skip?: number,
      id?: number
    } = {}
) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = {
    async fetchBlogList() {
      const blogQuery = queryBuilder(
        {
          skip: skip,
          limit: limit
        }
      );

      const res = await fetch(`http://localhost:3000/api/blog${blogQuery}`);
      const data = await res.json();

      dispatch({ type: 'SET_BLOG_LIST', payload: { blogs: data.blogs } });
    },
    async fetchBlogDetail() {
      const blogQuery = queryBuilder({
        id: id
      });

      const res = await fetch(`http://localhost:3000/api/blog${blogQuery}`);
      const data = await res.json();

      dispatch({ type: 'SET_BLOG_DETAIL', payload: { blogDetail: data.blogs[0] } });
    }
  };

  return {
    actions,
    state
  };
};

export default useBlog;