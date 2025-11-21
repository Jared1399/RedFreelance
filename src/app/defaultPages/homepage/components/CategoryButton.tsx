import React from 'react';
import Link from "next/link";

export default function CategoryButton({ categoryName }: { categoryName: string }) {
  return (
    <div className="
      flex
      items-center
      justify-center
      w-full
      h-[120px]
      sm:h-[140px]
      md:h-[160px]
      lg:h-[180px]
      xl:h-[200px]
      rounded-lg
      cursor-pointer
      bg-ring
      hover:bg-accent
      hover:shadow-[0px_4px_6px_0px_rgba(81,_81,_81,_0.8)]
      active:scale-95
      transition-all
      duration-300
      ease-in-out
    ">
      <Link
        className='
          w-full
          my-auto
          text-center
          text-sm
          sm:text-base
          md:text-lg
          lg:text-xl
          font-medium
          line-clamp-2
          break-words
          hyphens-auto
          text-white
        '
        href={`/categories/name/${categoryName}`}
      >
        {categoryName}
      </Link>
    </div>
  );
}