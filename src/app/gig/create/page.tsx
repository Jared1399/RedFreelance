'use client';
import clsx from 'clsx';
import { FormEvent } from 'react';

export default function CreateGig() {

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const payload = {
      title: formData.get("title"),
      description: formData.get("description"),
      price: parseInt(formData.get("price") as string),
      categories: [parseInt(formData.get("categories") as string)],
    };

    await fetch("/api/gig", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

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
        <option value="4">Edicion</option>
        <option value="5">Arte</option>
        <option value="6">Medicina online</option>
        <option value="7">Marketing</option>
      </select>
      <button type="submit">Submit</button>
    </form>
  );
}
