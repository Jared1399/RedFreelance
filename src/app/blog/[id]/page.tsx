"use client";
import React, { use, useEffect } from 'react';
import useBlog from '@/context/Blog/useBlog';
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Components } from "react-markdown";

interface Blog {
  title: string;
  content: string;
}

const components: Components = {
  h1: ({ ...props }) =>
    <h2
      className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100"
      {...props}
    />,
  h2: ({ ...props }) =>
    <h3
      className="text-xl font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-200"
      {...props}
    />,
  h3: ({ ...props }) =>
    <h4
      className="text-lg font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-200"
      {...props}
    />,
  p: ({ ...props }) =>
    <p
      className="mb-4 text-gray-800 dark:text-gray-300 leading-relaxed"
      {...props}
    />,
  a: ({ ...props }) =>
    <a
      className="text-blue-600 dark:text-blue-400 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />,
  blockquote: ({ ...props }) =>
    <blockquote
      className="
        border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic 
        text-gray-600 dark:text-gray-400 my-4
      "
      {...props}
    />,
  table: ({ ...props }) =>
    <div className="overflow-x-auto my-4">
      <table className="min-w-full border border-gray-300 dark:border-gray-600 text-sm"
        {...props}
      />
    </div>
  ,
  th: ({ ...props }) =>
    <th className="
        border px-3 py-2 bg-gray-100 dark:bg-gray-700 
        text-left font-medium dark:text-gray-100
      "
      {...props}
    />
  ,
  td: ({ ...props }) =>
    <td className="border px-3 py-2 dark:border-gray-600"
      {...props}
    />
  ,
  ul: ({ ...props }) =>
    <ul
      className="list-disc list-inside mb-4 text-gray-800 dark:text-gray-300"
      {...props}
    />,
  ol: ({ ...props }) =>
    <ol
      className="list-decimal list-inside mb-4 text-gray-800 dark:text-gray-300"
      {...props}
    />,
  li: ({ ...props }) =>
    <li
      className="mb-2"
      {...props}
    />,
  code: ({ children, ...props }) => (
    <code
      className={`bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono`}
      {...props}
    >
      {children}
    </code>
  )
};

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
      {/* Título del blog */}
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">{blog.title}</h1>

      {/* Contenido Markdown */}
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {blog.content}
      </Markdown>
    </div>
  );
}
