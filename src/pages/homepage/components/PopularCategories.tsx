'use client';
import React from 'react';
import SingleRowGrid from '@/components/UI/SingleRowGrid';
import useCategory from '@/context/Category/useCategory';


export default function PopularCategories() {
  const { state } = useCategory();

  const categoryList = state.categoryList.map((cat, i) => {
    return (
      <div key={i} className='bg-amber-800 flex align-middle justify-center h-[200px] rounded-lg'>
        <a className='my-auto' href={`/categories/name/${cat.name}`}>{cat.name}</a>
      </div>
    );
  });

  return (
    <div className='text-white bg-blue-700 my-8 h-[300px]'>
      <SingleRowGrid >
        {categoryList}
      </SingleRowGrid>
    </div>
  );
}
