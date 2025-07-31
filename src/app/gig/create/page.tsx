'use client';
import useCategory from '@/context/Category/useCategory';
import useUser from '@/context/User/useUser';
import clsx from 'clsx';
import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';


interface User {
  id: string;
}

export default function CreateGig() {

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
    "border-white"
  );

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="title" autoComplete="off" className={inputCls} />
      <input type="text" name="description" autoComplete="off" className={inputCls} />
      <input type="text" name="price" autoComplete="off" className={inputCls} />
      <select name="categories" className={inputCls} >
        {categoryList}
      </select>
      <button type="submit">Submit</button>
    </form>
  );
}
