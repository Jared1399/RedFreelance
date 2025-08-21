'use client';

import ScrollList from '@/components/UI/ScrollList';
import useBlog from '@/context/Blog/useBlog';
import React, { useEffect, useMemo } from 'react';

interface BlogDTO {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  authorId: string;
  href?: string;
}

export default function Blog() {
  const { state, actions } = useBlog();

  useEffect(() => {
    actions.fetchBlogList();
  }, []);

  const blogList = state.blogList as BlogDTO[];

  const blogDTO = useMemo(() => {

    return blogList.map((blog) => {

      const blogDesc = blog.content.length > 45 ?
        blog.content.slice(0, 50).concat(" ...") :
        blog.content;

      return {
        title: blog.title,
        description: blogDesc,
        href: `/blog/${blog.id}`
      };
    });

  }, [blogList]);

  return (
    <div>
      {blogDTO.length ? <ScrollList list={blogDTO} /> : <p>Cargando...</p>}
    </div>
  );
}
