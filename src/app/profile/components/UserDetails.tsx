import React from 'react';
import { UserData } from '../types/User';
import Image from '@/components/UI/Image';
import formatDateES from '@/lib/timeago';

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
    <div className='flex flex-col relative'>
      <div className='flex flex-row absolute right-10 top-5'>
        <div className='mr-4'>Seguidores: {details.followers.length}</div>
        <div>Siguiendo: {details.following.length}</div>
      </div>

      <div className='mt-15 ml-10'>
        <div className='flex flex-row items-center mb-4'>
          <Image alt='user-profile-pic' src={details.userImg} className='w-10 rounded-full mr-2' />
          <div>
            {details.firstName} {details.lastName} {details.isVerified ? "✅" : null}
          </div>
        </div>

        <div className='ml-12'>
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
