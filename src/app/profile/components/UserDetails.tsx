import React from 'react';
import { UserData } from '../types/User';
import Image from '@/components/UI/Image';
import formatDateES from '@/lib/timeago';
import { capitalizeFirst } from '@/lib/utils';
import EditProfileModal from './EditProfileModal';

const translateLevel = (levelEng: string): string => {
  const valuesES: Record<string, string> = {
    novice: "Novato",
    advanced: "Intermedio",
    expert: "Experto",
  };

  return valuesES[levelEng] ?? levelEng;
};

export default function UserDetails({ details }: { details: UserData }) {
  return (
    <div className='
      flex 
      flex-col 
      relative 
      dark:bg-card 
      dark:border 
      mx-2 
      md:mx-5 
      my-2 
      px-4 
      md:px-10 
      py-4 
      md:py-5 
      rounded-lg
    '>
      <div
        className='flex flex-row justify-end md:absolute md:right-10 md:top-5 z-10 gap-4 md:gap-4'
      >
        <div className='text-sm md:text-base'>Seguidores: {details.followers.length}</div>
        <div className='text-sm md:text-base'>Siguiendo: {details.following.length}</div>
      </div>

      <div className='mt-2 md:mt-0'>
        <div
          className='
            flex 
            flex-col 
            md:flex-row 
            items-start 
            md:items-center 
            mb-4 
            relative 
            gap-3 
            md:gap-0
          '
        >
          <div className='flex items-center gap-3 md:gap-4'>
            <Image
              alt='user-profile-pic'
              src={details.userImg}
              className="
                w-12
                h-12
                md:w-15
                md:h-15
                rounded-full
                outline-2
                md:outline-3
                outline-amber-50
                outline-offset-2
                md:outline-offset-4
                flex-shrink-0
            "
            />
            <EditProfileModal user={details} />
          </div>

          <div className='text-xl md:text-3xl font-medium md:font-normal md:ml-4'>
            {
              capitalizeFirst(
                `${details.firstName} 
                ${details.lastName} 
                ${details.isVerified ? "✅" : ""}`
              )
            }
          </div>
        </div>

        <div className='ml-0 md:ml-12 z-10 space-y-2 md:space-y-0'>
          <div className='text-sm md:text-base'>Nivel: {translateLevel(details.level)}</div>
          <div className='text-sm md:text-base'>{details.phone ?? "N/A"}</div>
          <div>
            {details.subscriptionPlan == "basic" ?
              null :
              (
                <div className='space-y-1 md:space-y-0'>
                  <div className='text-sm md:text-base font-medium'>Suscripción premium</div>
                  <div className='text-xs md:text-sm text-gray-600 dark:text-gray-400'>
                    desde {formatDateES(details.subscriptionStart)}
                  </div>
                  <div className='text-xs md:text-sm text-gray-600 dark:text-gray-400'>
                    acaba {formatDateES(details.subscriptionEnd)}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
