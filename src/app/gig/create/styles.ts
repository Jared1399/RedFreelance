import clsx from 'clsx';

export const formContainerCls = clsx(
  `
    flex
    flex-col
    justify-center
    w-170
    h-120
    mr-4 
    rounded-lg
    dark:bg-card
    dark:border
    px-12 
    py-2
    mt-15
    shadow-[0px_4px_6px_0px_rgba(81,_81,_81,_0.5)]
  `);

export const tierListContainerCls = clsx(
  `
    h-120 
    w-110 
    mt-15 
    px-4 
    py-10 
    rounded-lg 
    flex 
    flex-col 
    dark:bg-card 
    dark:border 
    shadow-[0px_4px_6px_0px_rgba(81,_81,_81,_0.5)]
  `);

export const tierScrollListCls = clsx(
  `
    h-full 
    w-full 
    mt-5 
    py-1 
    dark:bg-black 
    opacity-[0.8] 
    dark:border 
    rounded-lg 
    overflow-y-scroll 
    flex 
    flex-col 
    items-center
  `);