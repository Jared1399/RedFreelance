import React from 'react';
import SingleRowGrid from '@/components/UI/SingleRowGrid';
import CategoryButton from './CategoryButton';
import { Category } from './types/Category';
import { queryBuilder } from "@/lib/utils";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function PopularCategories() {
  const categoryQuery = queryBuilder({ skip: 0, limit: 10 });

  const res = await fetch(`${BASE_URL}/api/category${categoryQuery}`, {
    cache: "force-cache"
  });

  const categories = await res.json();

  const categoryList = categories.category.map((cat: Category) => {
    return (
      <CategoryButton key={cat.id} categoryName={cat.name} />
    );
  });

  return (
    <div className='text-white mb-10 mt-20 h-[300px]'>
      <h2 className='text-lg font-bold pl-6 '>Categorias populares entre nuestros usuarios</h2>
      <SingleRowGrid >
        {categoryList}
      </SingleRowGrid>
    </div>
  );
}
