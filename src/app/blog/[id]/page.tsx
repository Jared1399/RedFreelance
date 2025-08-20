"use client";
import React, { use, useEffect } from 'react';
import useBlog from '@/context/Blog/useBlog';

interface Blog {
  title: string;
}

export default function BlogDetail({ params }: { params: Promise<{ id: number }> }) {
  const { id } = use(params);

  const { state, actions } = useBlog({ id });
  const blog = state.blogDetail as Blog;

  useEffect(() => {
    actions.fetchBlogDetail();
  }, []);

  return (
    <div>{blog?.title ?? "Cargando..."}</div>
  );
}
