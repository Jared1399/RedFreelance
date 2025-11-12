import { useReducer } from 'react';
import { reducer, initialState } from './reducer';
import { queryBuilder } from "@/lib/utils";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

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

      const res = await fetch(`${BASE_URL}/api/blog${blogQuery}`);
      const data = await res.json();

      dispatch({ type: 'SET_BLOG_LIST', payload: { blogs: data.blogs } });
    },
    async fetchBlogDetail() {
      const res = await fetch(`${BASE_URL}/api/blog/id/${id}`);
      const data = await res.json();

      dispatch({ type: 'SET_BLOG_DETAIL', payload: { blogDetail: data } });
    }
  };

  return {
    actions,
    state
  };
};

export default useBlog;