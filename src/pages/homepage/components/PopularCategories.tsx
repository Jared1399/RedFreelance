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
    <div className='text-white my-8 h-[300px]'>
      <SingleRowGrid >
        {categoryList}
      </SingleRowGrid>
    </div>
  );
}
