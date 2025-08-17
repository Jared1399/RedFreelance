'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import clsx from 'clsx';


interface SingleRowGridProps {
  children: ReactNode[],
  childWidth?: number
}

const SingleRowGrid: React.FC<SingleRowGridProps> = ({ children, childWidth }) => {
  const [screenWidth, setscreenWidth] = useState(500);

  useEffect(() => {
    setscreenWidth(window.innerWidth);
  }, []);

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
    'gap-4',
    'px-4',
    'fade-mask'
  );

  const childrenArray = Array.from(children);
  const childrenWidth = childWidth ?? `${Math.ceil((screenWidth / childrenArray.length))}px`;

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