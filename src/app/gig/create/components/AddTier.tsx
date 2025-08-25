import Image from '@/components/UI/Image';

export default function AddTier({ addTierHandler }: { addTierHandler: () => void }) {
  return (
    <div
      className='
        w-95 
        py-3 
        px-4 
        my-2 
        h-fit 
        dark:bg-card 
        dark:border 
        rounded-lg 
        flex 
        flex-col 
        justify-center 
        items-center
      '>
      <div className='mb-2'>
        Agregar nivel
      </div>
      <div onClick={() => addTierHandler()}>
        <Image
          alt='add-tier-icon'
          src='/plus_icon.svg'
          className='w-10 rounded-full cursor-pointer'
        />
      </div>
    </div>
  );
}
