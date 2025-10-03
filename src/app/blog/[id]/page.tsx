"use client";
import React, { use, useEffect } from 'react';
import useBlog from '@/context/Blog/useBlog';
import MarkdownViewer from '@/components/MarkdownViewer';


interface Blog {
  title: string;
  content: string;
}


export default function BlogDetail({ params }: { params: Promise<{ id: number }> }) {
  const { id } = use(params);
  const { state, actions } = useBlog({ id });
  const blog = state.blogDetail as Blog;

  useEffect(() => {
    actions.fetchBlogDetail();
  }, []);

  if (!blog) {
    return <div className="text-center mt-10 text-gray-500 dark:text-gray-400">
      Cargando blog...
    </div>;
  }

  return (
    <div className="max-w-4xl mx-auto my-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        {blog.title}
      </h1>
      <MarkdownViewer content={blog.content} />
    </div>
  );
}
