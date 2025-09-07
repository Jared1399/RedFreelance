import React from 'react';
import Link from "next/link";

export default function CategoryButton({ categoryName }: { categoryName: string }) {
  return (
    <div className="
      bg-card
      dark:bg-card
      hover:bg-amber-700
      dark:hover:bg-amber-700
      hover:shadow-[0px_4px_6px_0px_rgba(81,_81,_81,_0.5)]
      flex
      items-center
      justify-center
      h-[200px]
      rounded-lg
      cursor-pointer
    ">
      <Link className='my-auto' href={`/categories/name/${categoryName}`}>{categoryName}</Link>
    </div>
  );
}
