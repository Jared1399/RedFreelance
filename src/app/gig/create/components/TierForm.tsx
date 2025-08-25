
import clsx from 'clsx';

interface Tier {
  localId?: number;
  name: string;
  price: number;
  description: string;
  deliveryTime: number;
}

const inputCls = clsx(
  "border",
  "border-solid",
  "border-white",
  "rounded",
  "mb-4"
);

export default function TierForm(
  { tier, onCloseHandler }:
    { tier: Tier, onCloseHandler: () => void }
) {
  return (
    <div className='w-[95%] p-2 px-4 my-2 h-fit dark:bg-card dark:border rounded-lg'>

      <div className='flex flex-row justify-between w-full relative'>
        <div
          className='absolute right-0 top-0 cursor-pointer'
          onClick={() => onCloseHandler()}>
          x
        </div>

        <div className='mt-8 w-full flex justify-between'>
          <label htmlFor="tierName">Nombre</label>
          <input
            type="text"
            name='tierName'
            defaultValue={tier.name}
            className={inputCls}
            autoComplete="off"
          />
        </div>
      </div>

      <div className='w-full flex justify-between'>
        <label htmlFor="tierDescription">Descripcion</label>
        <input
          type="text"
          name='tierDescription'
          defaultValue={tier.description}
          className={inputCls}
          autoComplete="off"
        />
      </div>

      <div className='w-full flex justify-between'>
        <label htmlFor="tierPrice">Precio (CLP) </label>
        <input
          type="number"
          name='tierPrice'
          defaultValue={tier.price}
          className={inputCls}
          autoComplete="off"
        />
      </div>

      <div className='w-full flex justify-between'>
        <label htmlFor="tierPrice">Tiempo de entrega</label>
        <input
          type="number"
          name='tierPrice'
          defaultValue={tier.deliveryTime}
          className={inputCls}
          autoComplete="off"
        />
      </div>

    </div>
  );
}