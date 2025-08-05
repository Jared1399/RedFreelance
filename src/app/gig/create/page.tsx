'use client';
import useCategory from '@/context/Category/useCategory';
import { useSession } from "next-auth/react";
import useUser from '@/context/User/useUser';
import clsx from 'clsx';
import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import AuthMiddleware from "@/components/AuthMiddleware";


interface User {
  id: string;
}

export default function CreateGig() {
  const { status } = useSession();
  const { state } = useCategory();
  const { state: userState } = useUser();
  const router = useRouter();

  const categoryList = state.categoryList.length ?
    state.categoryList.map((cat) => {
      return (
        <option key={`${cat.id}-${cat.name}`} value={cat.id}>{cat.name}</option>
      );
    }) :
    null;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const payload = {
      title: formData.get("title"),
      description: formData.get("description"),
      price: parseInt(formData.get("price") as string),
      categories: [parseInt(formData.get("categories") as string)],
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

  return (
    <AuthMiddleware status={status}>
      <div className={formContainerCls}>
        <h1 className='text-3xl pb-8 mx-auto'>Crear un nuevo trabajo</h1>
        <form onSubmit={onSubmit} className='flex flex-col '>

          <label className={labelCls} htmlFor="title">Titulo</label>
          <input type="text" name="title" autoComplete="off" className={inputCls} />

          <label className={labelCls} htmlFor="description">Descripcion</label>
          <input type="text" name="description" autoComplete="off" className={inputCls} />

          <label className={labelCls} htmlFor="price">Precio</label>
          <input type="number" name="price" autoComplete="off" className={inputCls} />

          <label className={labelCls} htmlFor="categories">Categorias</label>
          <select name="categories" className={inputCls} >
            {categoryList}

          </select>
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
