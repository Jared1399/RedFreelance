import React from 'react';
import { UserData } from '../types/User';
import Image from '@/components/UI/Image';
import formatDateES from '@/lib/timeago';
import { capitalizeFirst } from '@/lib/utils';

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
      mx-5 
      my-2 
      px-10 
      py-5 
      rounded-lg
    '>
      <div className='flex flex-row absolute right-10 top-5 z-10'>
        <div className='mr-4'>Seguidores: {details.followers.length}</div>
        <div>Siguiendo: {details.following.length}</div>
      </div>


      <div>
        <div className='flex flex-row items-center mb-4'>
          <Image alt='user-profile-pic' src={details.userImg} className="
              w-15
              h-15
              mr-4
              rounded-full
              outline-3
              outline-amber-50
              outline-offset-4
             " />
          <div className='text-3xl'>
            {
              capitalizeFirst(
                `${details.firstName} 
                ${details.lastName} 
                ${details.isVerified ? "✅" : ""}`
              )
            }
          </div>
        </div>

        <div className='ml-12 z-10'>
          <div>Nivel: {translateLevel(details.level)}</div>
          <div>{details.phone ?? "N/A"}</div>
          <div>
            {details.subscriptionPlan == "basic" ?
              null :
              (
                <div>
                  <div>Suscripcion premium</div>
                  <div>desde {formatDateES(details.subscriptionStart)}</div>
                  <div>acaba {formatDateES(details.subscriptionEnd)}</div>
                </div>
              )}
          </div>
        </div>


      </div>

    </div>
  );
}
