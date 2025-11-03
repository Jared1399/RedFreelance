'use client';
import React, { ReactNode } from 'react';
import clsx from 'clsx';
interface GridProps {
  children: ReactNode,
  className: string
}

const Grid: React.FC<GridProps> = ({ children, className }) => {

  if (!children) {
    return <div>No elements yet to show</div>;
  }

  const gridClasses = clsx(
    'grid',
    'grid-cols-[repeat(auto-fill,minmax(250px,1fr))]',
    'gap-4',
    'overflow-hidden',
    className
  );


  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};

export default Grid;