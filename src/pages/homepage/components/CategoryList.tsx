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
    <div className='text-accent-foreground my-8 h-[235px]'>
      <SingleRowGrid >
        {categoryList}
      </SingleRowGrid>
    </div>
  );
}
