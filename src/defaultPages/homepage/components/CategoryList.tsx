import React from 'react';
import SingleRowGrid from '@/components/UI/SingleRowGrid';
import CategoryButton from './CategoryButton';
import { queryBuilder } from "@/lib/utils";
import { Category } from './types/Category';

export const dynamic = "force-dynamic";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function CategoryList() {
  const categoryQuery = queryBuilder({ skip: 0, limit: 10 });

  const res = await fetch(`${BASE_URL}/api/category${categoryQuery}`, {
    cache: "no-store"
  });

  const categories = await res.json();

  const categoryList = categories.category.map((cat: Category) => {
    return (
      <CategoryButton key={cat.id} categoryName={cat.name} />
    );
  });

  return (
    <div
      data-component="CategoryList"
      className='
        text-accent-foreground 
        my-6 
        sm:my-8 
        lg:my-12 
        h-auto 
        min-h-[200px]
        sm:min-h-[235px]
      '
    >
      <h2 className='
        text-lg 
        sm:text-xl 
        lg:text-2xl 
        font-bold 
        pl-4 
        sm:pl-6 
        mb-4 
        sm:mb-6
        text-center 
        sm:text-left
      '>
        Puede que te interesen estas categorías
      </h2>
      <SingleRowGrid>
        {categoryList}
      </SingleRowGrid>
    </div>
  );
}