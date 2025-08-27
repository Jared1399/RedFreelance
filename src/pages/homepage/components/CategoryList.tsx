import React from 'react';
import SingleRowGrid from '@/components/UI/SingleRowGrid';
import CategoryButton from './CategoryButton';
import { queryBuilder } from "@/lib/utils";
import { Category } from './types/Category';

export default async function CategoryList() {
  const categoryQuery = queryBuilder({ skip: 0, limit: 10 });

  const res = await fetch(`http://localhost:3000/api/category${categoryQuery}`, {
    cache: "force-cache"
  });

  const categories = await res.json();

  const categoryList = categories.category.map((cat: Category) => {
    return (
      <CategoryButton key={cat.id} categoryName={cat.name} />
    );
  });

  return (
    <div data-component="CategoryList" className='text-accent-foreground my-8 h-[235px]'>
      <h2 className='text-lg font-bold pl-6 mb-4'>Puede que te interesen estas categorias</h2>
      <SingleRowGrid >
        {categoryList}
      </SingleRowGrid>
    </div>
  );
}
