import React from 'react';
import Image from "@/components/UI/Image";

export default function BlogEntry() {
  return (
    <div className='
      text-zinc-800 
      bg-emerald-500 
      my-8 h-[560px] 
      flex 
      flex-row 
      align-middle 
      justify-between px-6 py-4'
    >
      <div className='h-[100%] w-[50%]'>
        <Image alt='blog-image' className='w-full h-full' />
      </div>

      <div className='h-[100%] w-[50%] bg-amber-200 ml-4 flex flex-col justify-between py-8'>
        <div className='bg-amber-500 h-[30%]'>
          blog1
        </div>
        <div className='bg-amber-500 h-[30%]'>
          blog2
        </div>
      </div>
    </div>
  );
}
