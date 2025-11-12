import clsx from 'clsx';
export const formContainerCls = clsx(
  `
    flex
    flex-col
    w-full
    rounded-lg
    bg-background
    text-foreground
    border
    border-border
    px-6
    sm:px-8
    lg:px-12 
    py-6
    sm:py-8
    mt-8
    lg:mt-15
    shadow-[0px_4px_6px_0px_rgba(81,_81,_81,_0.5)]
  `
);

export const tierListContainerCls = clsx(
  `
    h-full
    w-full
    lg:w-110 
    mt-6
    lg:mt-15 
    px-4 
    sm:px-6
    py-6
    sm:py-8
    lg:py-10 
    rounded-lg 
    flex 
    flex-col 
    bg-background 
    text-foreground
    border
    border-border
    shadow-[0px_4px_6px_0px_rgba(81,_81,_81,_0.5)]
  `
);

export const tierScrollListCls = clsx(
  `
    h-64
    sm:h-72
    w-full 
    px-4
    mt-4
    lg:mt-5 
    py-3
    lg:py-1 
    bg-muted/60
    text-foreground
    border
    border-border
    rounded-lg 
    overflow-y-scroll 
    flex 
    flex-col 
    items-center
    gap-3
  `
);
