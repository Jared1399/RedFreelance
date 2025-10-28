import React, { useState } from 'react';

export default function InfoBanner({ icon, content }: { icon: string, content: string }) {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <>
      <div
        className='absolute top-3 right-5 text-2xl font-normal select-none cursor-pointer'
        onClick={() => setShowBanner(!showBanner)}
      >
        {icon}
      </div>
      {
        showBanner && (
          <div
            className="absolute top-14 inset-x-0 flex justify-center bg-neutral-700/50 py-2 z-10"
          >
            <p className="font-normal">
              {content}

            </p>
          </div>
        )
      }
    </>
  );
}