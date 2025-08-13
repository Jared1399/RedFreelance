'use client';
import useCategory from '@/context/Category/useCategory';
import { useSession } from "next-auth/react";
import useUser from '@/context/User/useUser';
import clsx from 'clsx';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthMiddleware from "@/components/AuthMiddleware";
import PoolSelect from '@/components/UI/PoolSelect';


interface User {
  id: string;
}

export default function CreateGig() {
  const { status } = useSession();
  const { state: categoryState } = useCategory({ skip: 0, limit: 10 });
  const { state: userState } = useUser();
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const payload = {
      title: formData.get("title"),
      description: formData.get("description"),
      price: parseInt(formData.get("price") as string),
      categories: formData.get("categories") as string,
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

  const inputCls = clsx(
    "border",
    "border-solid",
    "border-white",
    "rounded",
    "mb-4"
  );

  const formContainerCls = clsx(
    "flex",
    "flex-col",
    "justify-center",
    "w-200",
    "h-[500px]",
    "mx-auto ",
    "rounded-lg",
    "dark:bg-card",
    "dark:border",
    "px-12 ",
    "py-2",
    "mt-15",
    "shadow-[0px_4px_6px_0px_rgba(81,_81,_81,_0.5)]"
  );

  const labelCls = clsx(
    "mb-1",
    "text-l"
  );

  const handleChange = (ids: number[]) => {
    setSelectedIds(ids);
  };

  return (
    <AuthMiddleware status={status}>
      <div className={formContainerCls}>
        <h1 className='text-3xl pb-8 mx-auto'>Crear un nuevo trabajo</h1>
        <form onSubmit={onSubmit} className='flex flex-col ' action="POST">

          <label className={labelCls} htmlFor="title">Titulo</label>
          <input type="text" name="title" autoComplete="off" className={inputCls} />

          <label className={labelCls} htmlFor="description">Descripcion</label>
          <input type="text" name="description" autoComplete="off" className={inputCls} />

          <label className={labelCls} htmlFor="price">Precio</label>
          <input type="number" name="price" autoComplete="off" className={inputCls} />

          <label className={labelCls} htmlFor="categories">Categorias</label>
          <PoolSelect options={categoryState.categoryList} onChange={handleChange} />
          <input type="hidden" name="categories" value={selectedIds.join(",")} />
          <button
            className="cursor-pointer rounded-full bg-amber-800 w-25 mx-auto mt-10"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </AuthMiddleware>

  );
}
