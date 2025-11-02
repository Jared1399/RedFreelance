import React, { useState } from 'react';

export default function InfoBanner({ icon, content }: { icon: string, content: string }) {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <>
      <div
        className='
          absolute 
          top-3 
          right-3 
          md:right-5 
          text-xl 
          md:text-2xl 
          font-normal 
          select-none 
          cursor-pointer 
          z-20
        '
        onClick={() => setShowBanner(!showBanner)}
      >
        {icon}
      </div>
      {
        showBanner && (
          <div
            className="
              absolute 
              top-12 
              md:top-14 
              inset-x-0 
              flex 
              justify-center 
              bg-neutral-700/50 
              py-2 
              px-3 
              md:px-0 
              z-10
            "
          >
            <p className="font-normal text-sm md:text-base text-center max-w-[90%] md:max-w-none">
              {content}
            </p>
          </div>
        )
      }
    </>
  );
}