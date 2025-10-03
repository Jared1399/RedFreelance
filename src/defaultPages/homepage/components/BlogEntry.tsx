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
        <span className='text-sm text-amber-600 underline'>
          <Link href={"/blog"}>Ver todos</Link>
        </span>
        <div className='overflow-auto'>
          {blogs}
        </div>
      </div>
    </div>
  );
}
