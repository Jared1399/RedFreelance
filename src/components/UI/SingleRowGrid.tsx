'use client';
import React, { ReactNode } from 'react';
import clsx from 'clsx';

interface SingleRowGridProps {
  children: ReactNode[],
}

const SingleRowGrid: React.FC<SingleRowGridProps> = ({ children }) => {
  if (!children || children.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay elementos para mostrar
      </div>
    );
  }

  const gridClasses = clsx(
    'flex',
    'justify-center',
    'items-stretch',
    'align-middle',
    'w-full',
    'h-full',
    'overflow-x-scroll',
    'lg:overflow-x-scroll',
    'snap-x',
    'snap-mandatory',
    'lg:snap-none',
    'gap-4',
    'sm:gap-6',
    'lg:gap-8',
    'xl:gap-10',
    'px-4',
    'sm:px-6',
    'lg:px-8',
    'fade-mask',
    'lg:fade-mask-none'
  );

  const childrenArray = Array.from(children);

  const gridElements = childrenArray.map((child, i) => {
    return (
      <div
        key={i}
        className="
          flex-shrink-0 snap-start 
          h-auto
          py-2
          w-[160px]
          sm:w-[180px] 
          md:w-[260px] 
          lg:w-[300px] 
          xl:w-[370px] 
          flex flex-col
        "
      >
        {child}
      </div>
    );
  });

  return (
    <div className={gridClasses}>
      {gridElements}
    </div>
  );
};

export default SingleRowGrid;