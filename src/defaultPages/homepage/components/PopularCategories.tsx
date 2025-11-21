import React from 'react';
import SingleRowGrid from '@/components/UI/SingleRowGrid';
import CategoryButton from './CategoryButton';
import { Category } from './types/Category';
import { queryBuilder } from "@/lib/utils";
import { authFetch } from '@/lib/authFetch';

export const dynamic = "force-dynamic";

export default async function PopularCategories() {
  const categoryQuery = queryBuilder({ skip: 0, limit: 10 });

  const res = await authFetch(`/api/category${categoryQuery}`, {
    cache: "no-store"
  });

  const categories = await res.json();

  const categoryList = categories.category.map((cat: Category) => {
    return (
      <CategoryButton key={cat.id} categoryName={cat.name} />
    );
  });

  return (
    <div className='mb-10 mt-20 h-[300px]'>
      <h2 className='
        text-muted-foreground
        text-lg 
        sm:text-xl 
        lg:text-2xl 
        font-bold 
        pl-6
        sm:pl-6 
        mb-4 
        sm:mb-6
        text-center 
        sm:text-left
      '>
        Categorias populares entre nuestros usuarios
      </h2>
      <SingleRowGrid >
        {categoryList}
      </SingleRowGrid>
    </div>
  );
}
