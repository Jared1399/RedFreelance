'use client';
import React from 'react';
import SingleRowGrid from '@/components/UI/SingleRowGrid';
import useCategory from '@/context/Category/useCategory';


export default function CategoryList() {

  const { state } = useCategory();

  const categoryList = state.categoryList.map((cat, i) => {
    return (
      <div key={i} className='bg-amber-100 flex align-middle justify-center h-[200px] rounded-lg'>
        <a className='my-auto' href={`/categories/name/${cat.name}`}>{cat.name}</a>
      </div>
    );
  });

  return (
    <div className='text-zinc-700 bg-amber-500 my-8 h-[235px]'>
      <SingleRowGrid >
        {categoryList}
      </SingleRowGrid>
    </div>
  );
}
