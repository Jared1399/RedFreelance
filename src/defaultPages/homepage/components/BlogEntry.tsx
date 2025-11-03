"use client";

import React, { useEffect } from 'react';
import Image from "@/components/UI/Image";
import useBlog from '@/context/Blog/useBlog';
import Link from 'next/link';
import BlogItem from './BlogItem';

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
    return <BlogItem blog={blog} key={blog.id} />;
  });

  return (
    <div className='
      text-zinc-800 
      my-6 
      sm:my-8 
      lg:my-12
      px-4 
      sm:px-6
      lg:px-8'
    >
      <div
        className='
          bg-neutral-900
          rounded-lg
          flex 
          flex-col
          lg:flex-row 
          justify-between 
          p-4
          sm:p-6
          lg:p-8
          gap-6
          lg:gap-8
          min-h-[400px]
          sm:min-h-[500px]
          lg:min-h-[560px]'
      >
        <div className='
          my-auto
          h-full
          lg:h-full 
          w-full
          lg:w-[50%] 
          flex-shrink-0
          rounded-lg
          overflow-hidden'
        >
          <Image
            alt='blog-image'
            className='w-full h-full object-cover'
          />
        </div>

        <div
          className='
            h-full
            lg:h-full
            w-full
            lg:w-[50%]
            flex
            flex-col
            justify-between'
        >
          <span className='text-sm sm:text-base text-amber-600 underline lg:mb-0'>
            <Link href={"/blog"}>Ver todos los artículos</Link>
          </span>
          <div className='overflow-auto flex-1 space-y-4 lg:space-y-6'>
            {blogs}
          </div>
        </div>
      </div>
    </div>
  );
}