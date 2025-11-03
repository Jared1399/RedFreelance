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
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2">Blog RedFreelance</h2>
        <div className="w-12 h- rounded-full"></div>
      </div>

      {blogDTO.length ? (
        <div className=" rounded-lg shadow-sm border">
          <ScrollList list={blogDTO} />
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12">
          <div
            className="
              inline-block 
              animate-spin 
              rounded-full 
              h-8 
              w-8 
              border-b-2 
              border-gray-300 
              mb-4">
          </div>
          <p className="text-gray-600">Cargando artículos...</p>
        </div>
      )}
    </div>
  );
}