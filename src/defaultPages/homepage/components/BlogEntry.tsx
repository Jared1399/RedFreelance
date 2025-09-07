"use client";

import React, { useEffect } from 'react';
import Image from "@/components/UI/Image";
import useBlog from '@/context/Blog/useBlog';

interface Blog {
  title: string;
  content: string;
  id: number;
}

export default function BlogEntry() {

  const { state, actions } = useBlog({ limit: 2 });

  useEffect(() => {
    actions.fetchBlogList();
  }, []);

  const blogs = state.blogList.map((blog: Blog) => {
    return (
      <div key={blog.id}
        className="
        bg-neutral-700
        py-8
        px-8
        rounded-lg
        shadow-md
        hover:shadow-lg
        transition-shadow
        duration-200
        flex
        flex-col
        justify-between
        h-[200px]
        md:h-[250px]
        my-4"
      >
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
          {blog.title}
        </h3>

        <p className="text-white text-sm line-clamp-3 mb-4">
          {blog.content}
        </p>
        <a
          className="cursor-pointer mt-4 text-white font-semibold underline hover:text-amber-600"
          href={`/blog/${blog.id}`}
        >
          Leer más
        </a>
      </div>

    );
  });

  return (
    <div className='
      text-zinc-800 
      my-8 h-[560px] 
      flex 
      flex-row 
      align-middle 
      justify-between px-6 py-4'
    >
      <div className='h-[100%] w-[50%]'>
        <Image alt='blog-image' className='w-full h-full rounded-lg' />
      </div>

      <div
        className='
          h-[100%]
          w-[50%]
          bg-neutral-900
          ml-4
          flex
          flex-col
          justify-between
          py-8
          px-4
          rounded-lg'
      >
        {blogs}
      </div>
    </div>
  );
}
