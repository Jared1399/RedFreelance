'use client';

import useCategory from '@/context/Category/useCategory';
import { useSession } from "next-auth/react";
import useUser from '@/context/User/useUser';
import clsx from 'clsx';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthMiddleware from "@/components/ClientAuthMiddleware";
import PoolSelect from '@/components/UI/PoolSelect';
import useTier from './hooks/useTier';
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
  "border",
  "border-solid",
  "border-white",
  "rounded",
  "mb-4"
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
      <div className='absolute top-14 left-0 w-full'>
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

      <div className='flex flex-row align-middle justify-center mb-15'>
        <div className={formContainerCls}>
          <h1 className='text-3xl pb-8 mx-auto'>Crear un nuevo trabajo</h1>
          <form onSubmit={onSubmit} className='flex flex-col ' action="POST">

            <label className={labelCls} htmlFor="title">Titulo</label>
            <input type="text" name="title" autoComplete="off" className={inputCls} />

            <label className={labelCls} htmlFor="description">Descripcion</label>
            <input type="text" name="description" autoComplete="off" className={inputCls} />

            <label className={labelCls} htmlFor="price">Precio base</label>
            <input type="number" name="price" autoComplete="off" className={inputCls} />

            <div className='relative flex flex-col'>
              <label className={labelCls} htmlFor="categories">Categorias</label>
              <input
                type="text"
                name="searchCategories"
                autoComplete="off"
                className={inputCls}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  categoryActions.searchCategories(e.target.value);
                }}
              />
              {searchResults == 0 ? null : searchResults}

              <PoolSelect options={categoryState.categoryList} onChange={handleChange} />
              <input type="hidden" name="categories" value={selectedIds.join(",")} />

            </div>

            <button
              className="cursor-pointer rounded-full bg-amber-800 w-25 mx-auto mt-10"
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>

        <div className={tierListContainerCls}>
          <div className='text-xl'>Niveles</div>
          <span className='text-sm opacity-[0.5]'>
            Define los niveles en los que tus clientes pueden solicitar tus servicios
          </span>

          <div className={tierScrollListCls}>
            {tierList}
            {
              !!tierState.tierList.length && (
                <div onClick={() => addTier()} className='mt-2'>
                  <Image
                    alt='add-tier-icon'
                    src='/plus_icon.svg'
                    className='w-10 rounded-full cursor-pointer'
                  />
                </div>
              )
            }
          </div>
        </div>
      </div>
    </AuthMiddleware>

  );
}
