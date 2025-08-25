'use client';
import React, { ReactNode } from 'react';
import clsx from 'clsx';


interface SingleRowGridProps {
  children: ReactNode[],
  childWidth?: number
}

const SingleRowGrid: React.FC<SingleRowGridProps> = ({ children, childWidth }) => {
  if (!children) {
    return <div>No elements yet to show</div>;
  }

  const gridClasses = clsx(
    'flex',
    'justify-evenly',
    'align-center',
    'overflow-x-auto',
    'overflow-y-hidden',
    'w-full',
    'h-full',
    'gap-[3vw]',
    'px-4',
    'fade-mask'
  );

  const childrenArray = Array.from(children);
  const childrenWidth = childWidth ?? '25vw';

  const gridElements = childrenArray.map((child, i) => {
    return (
      <div key={i}
        className="my-auto shrink-0"
        style={{ width: childrenWidth }}
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