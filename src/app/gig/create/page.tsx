'use client';

import useCategory from '@/context/Category/useCategory';
import { useSession } from "next-auth/react";
import useUser from '@/context/User/useUser';
import clsx from 'clsx';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthMiddleware from "@/components/ClientAuthMiddleware";
import PoolSelect from '@/components/UI/PoolSelect';
import useTier from '@/context/Tier/index';
import Image from '@/components/UI/Image';
import TierForm from './components/TierForm';
import AddTier from './components/AddTier';
import { formContainerCls, tierListContainerCls, tierScrollListCls } from './styles';

interface User {
  id: string;
}

interface Tier {
  localId: number;
  name: string;
  price: number;
  description: string;
  deliveryTime: number;
}

interface Category {
  id?: string;
  name: string;
  description: string;
  userId: string;
  created_at: Date;
  updated_at: Date;
}

const inputCls = clsx(
  "w-full",
  "px-4",
  "py-3",
  "border",
  "border-neutral-300",
  "dark:border-neutral-600",
  "rounded-lg",
  "bg-white",
  "dark:bg-neutral-800",
  "text-neutral-900",
  "dark:text-white",
  "focus:outline-none",
  "focus:border-amber-500",
  "focus:ring-2",
  "focus:ring-amber-200",
  "dark:focus:ring-amber-800",
  "transition-all",
  "duration-200",
  "placeholder-neutral-500",
  "dark:placeholder-neutral-400",
);

export default function CreateGig() {
  const router = useRouter();

  const { status, data: session } = useSession();
  const { state: categoryState, actions: categoryActions } = useCategory({ skip: 0, limit: 10 });
  const { state: userState, actions: userActions } = useUser();
  const { state: tierState, actions: tierActions } = useTier();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      title: formData.get("title"),
      description: formData.get("description"),
      price: parseInt(formData.get("price") as string),
      categories: formData.get("categories") as string,
      tiers: tierState.tierList,
      userId: (userState?.userData as User)?.id
    };

    const res = await fetch("/api/gig", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push('/gig');
    }
  }

  const labelCls = clsx(
    "mb-1",
    "text-l"
  );

  const handleChange = (ids: number[]) => {
    setSelectedIds(ids);
  };

  const tierComponents = tierState.tierList.map((t: Tier) => {
    return (
      <TierForm
        tier={t}
        onCloseHandler={() => tierActions.removeTier(t.localId!)}
        updateTierHandler={tierActions.updateTier}
        key={t.localId}
      />
    );
  });

  const addTier = () => {
    const generatedId = Number.parseInt((Math.random() * 1000).toString());

    tierActions.addTier(
      {
        localId: generatedId,
        name: "",
        price: 0,
        description: "",
        deliveryTime: 0
      }
    );
  };

  const tierList = tierComponents.length ? tierComponents : <AddTier addTierHandler={addTier} />;
  const [search, setSearch] = useState("");

  const handleSearchCategory = (cat: Category) => {
    let repeated = false;
    categoryState.categoryList.map((c) => {
      if (c.name == cat.name) { repeated = true; }
    });

    if (!repeated) {
      categoryActions.addCategory(cat);
    }

    setSearch("");
  };

  const searchResults = (
    search && categoryState.searchCategories.length && (
      <div className='absolute top-19 left-0 w-full rounded-lg overflow-hidden'>
        {categoryState.searchCategories.map((cat) => (
          <div
            className="w-full bg-neutral-700 h-fit px-2 py-1 hover:bg-neutral-800"
            key={cat.id}
            onClick={() => handleSearchCategory(cat)}
          >
            {cat.name}
          </div>
        ))}
      </div>
    )
  );

  useEffect(() => {
    userActions.fetchUserData();
  }, [session?.userId]);

  return (
    <AuthMiddleware status={status}>
      <div
        className='
          flex 
          flex-col 
          lg:flex-row 
          align-middle 
          justify-center 
          gap-6 
          lg:gap-8 
          mb-8 
          lg:mb-15 
          mx-2
        '>
        <div className={formContainerCls + " w-full lg:w-1/2 flex flex-col"}>
          <h1
            className='
              text-2xl 
              sm:text-3xl 
              font-bold 
              text-gray-900 
              dark:text-white 
              pb-6 
              sm:pb-8 
              text-center 
              lg:text-left
            '>

            Crear un nuevo trabajo
          </h1>

          <form onSubmit={onSubmit} className='flex flex-col gap-6 sm:gap-8 flex-1' action="POST">

            <div className="space-y-2">
              <label className={labelCls} htmlFor="title">Título del trabajo</label>
              <input
                type="text"
                name="title"
                autoComplete="off"
                className={inputCls}
                placeholder="Ej: Diseño de logo profesional"
              />
            </div>

            <div className="space-y-2">
              <label className={labelCls} htmlFor="description">Descripción</label>
              <textarea
                name="description"
                autoComplete="off"
                className={inputCls + " min-h-[100px] resize-none overflow-y-auto"}
                placeholder="Describe los detalles de tu servicio..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label className={labelCls} htmlFor="price">Precio base (CLP)</label>
              <div className="relative">
                <span
                  className="
                    absolute 
                    left-4 
                    top-1/2 
                    transform 
                    -translate-y-1/2 
                    text-gray-500 
                    dark:text-gray-400
                  ">
                  $
                </span>
                <input
                  type="number"
                  name="price"
                  autoComplete="off"
                  className={inputCls + " pl-10"}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2 relative">
              <label className={labelCls} htmlFor="categories">Categorías</label>
              <input
                type="text"
                name="searchCategories"
                autoComplete="off"
                className={inputCls}
                value={search}
                placeholder="Buscar categorías..."
                onChange={(e) => {
                  setSearch(e.target.value);
                  categoryActions.searchCategories(e.target.value);
                }}
              />

              {searchResults == 0 ? null : searchResults}

              <div className="mt-4">
                <PoolSelect options={categoryState.categoryList} onChange={handleChange} />
              </div>

              <input type="hidden" name="categories" value={selectedIds.join(",")} />
            </div>
            <div className="hidden lg:flex mx-auto transform">
              <button
                className="
                  cursor-pointer 
                  rounded-full 
                  bg-amber-600 
                  hover:bg-amber-700 
                  text-white 
                  font-semibold 
                  w-40 
                  py-3 
                  px-8 
                  text-base 
                  transition-colors 
                  duration-200 
                  shadow-lg 
                  hover:shadow-xl
                "
                type="submit"
              >
                Crear Trabajo
              </button>
            </div>
          </form>
        </div>

        <div className={tierListContainerCls + " w-full lg:w-1/2"}>
          <div className='text-lg sm:text-xl mb-2'>Niveles</div>
          <span className='text-xs sm:text-sm opacity-[0.5] block mb-4 sm:mb-6'>
            Define los niveles en los que tus clientes pueden solicitar tus servicios
          </span>

          <div className={tierScrollListCls}>
            {tierList}
            {
              !!tierState.tierList.length && (
                <div onClick={() => addTier()} className='mt-4 flex justify-center'>
                  <Image
                    alt='add-tier-icon'
                    src='/plus_icon.svg'
                    className='w-8 sm:w-10 rounded-full cursor-pointer'
                  />
                </div>
              )
            }
          </div>
        </div>

        <div className="lg:hidden w-full mt-6">
          <button
            className="
              cursor-pointer 
              rounded-full 
              bg-amber-600 
              hover:bg-amber-700 
              text-white 
              font-semibold 
              w-full 
              py-4 
              px-8 
              text-base 
              transition-colors 
              duration-200 
              shadow-lg 
              hover:shadow-xl
            "
            type="submit"
          >
            Crear Trabajo
          </button>
        </div>


      </div>
    </AuthMiddleware>

  );
}
