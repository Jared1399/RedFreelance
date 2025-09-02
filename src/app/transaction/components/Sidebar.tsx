'use client';
import React, { useState } from "react";
import { Home } from "lucide-react";
import { TransactionInterface } from "../types/Transaction";

const SidebarBody = ({ sidebarItems }: { sidebarItems: [] }) => {
  const [open, setOpen] = useState(true);
  const items = sidebarItems.map((item: TransactionInterface, i: number) => {
    return (
      <SidebarItem
        icon={<Home size={20} />}
        text={`${item.gig.title} - ${item.tier.name}`}
        open={open}
        key={i}
      />
    );
  });

  return (
    <div
      className={`${open ? "w-60" : "w-16"
        } bg-neutral-700 text-white h-screen p-4 transition-all duration-300 flex flex-col`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="mb-6 text-gray-300 hover:text-white place-self-start"
      >
        {open ? "⏪" : "⏩"}
      </button>

      <nav className="flex flex-col gap-4">
        {items}
      </nav>
    </div>
  );
};

export default function Sidebar(
  { children, sidebarItems }:
    { children: React.ReactNode, sidebarItems: [] }
) {

  return (
    <div className="flex">
      <SidebarBody sidebarItems={sidebarItems} />

      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

type SidebarItemProps = {
  icon: React.ReactNode;
  text: string;
  open: boolean;
};

function SidebarItem({ icon, text, open }: SidebarItemProps) {
  return (
    <div
      className="
        flex 
        items-center 
        gap-3 
        p-2 
        rounded-md 
        hover:bg-amber-700 
        cursor-pointer 
        overflow-hidden 
        transition-all 
        duration-300
      "
    >
      {icon}
      <span
        className={`
          whitespace-nowrap 
          transition-opacity 
          duration-200 
          ${open ? "opacity-100" : "opacity-0"}
          `}
      >
        {text}
      </span>
    </div>
  );
}
