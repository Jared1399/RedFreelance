'use client';
import React from 'react';
import SingleRowGrid from '@/components/UI/SingleRowGrid';
import useCategory from '@/context/Category/useCategory';
import CategoryButton from './CategoryButton';


export default function CategoryList() {

  const { state } = useCategory();

  const categoryList = state.categoryList.map((cat, i) => {
    return (
      <CategoryButton key={i} categoryName={cat.name} />
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
