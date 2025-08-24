'use client';
import React from 'react';
import SingleRowGrid from '@/components/UI/SingleRowGrid';
import useCategory from '@/context/Category/useCategory';
import CategoryButton from './CategoryButton';


export default function PopularCategories() {
  const { state } = useCategory();

  const categoryList = state.categoryList.map((cat, i) => {
    return (
      <CategoryButton key={i} categoryName={cat.name} />
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
