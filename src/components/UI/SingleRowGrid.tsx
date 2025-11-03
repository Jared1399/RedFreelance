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
    'w-full',
    'h-full',
    'overflow-x-auto',
    'lg:overflow-x-visible',
    'overflow-y-hidden',
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
          w-[160px] h-[200px]
          sm:w-[180px] sm:h-[220px]
          md:w-[260px] md:h-[240px]
          lg:w-[300px] lg:h-[260px]
          xl:w-[400px] xl:h-[350px]
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