'use client';
import React, { useContext, useState } from "react";
import { Home, Menu, X } from "lucide-react";
import { TransactionInterface } from "../types/Transaction";
import { TransactionContext } from "../hooks/UseTransaction/context";

export default function Sidebar(
  { children, sidebarItems }:
    { children: React.ReactNode, sidebarItems: [] }
) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex">
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <SidebarBody
        sidebarItems={sidebarItems}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="flex-1 relative">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="
            md:hidden 
            fixed 
            top-5 
            left-4 
            z-30 
            bg-accent 
            text-white 
            p-2 
            rounded-md 
            shadow-lg
          "
        >
          <Menu size={20} />
        </button>

        {children}
      </div>
    </div>
  );
}

type SidebarItemProps = {
  icon: React.ReactNode;
  text: string;
  open: boolean;
  id: string;
  isMobile?: boolean;
};

const SidebarBody = ({
  sidebarItems,
  isMobileOpen,
  setIsMobileOpen
}: {
  sidebarItems: [];
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}) => {
  const [open, setOpen] = useState(true);

  if (!sidebarItems.length) return null;

  const items = sidebarItems.map((item: TransactionInterface, i: number) => {
    const trimTitle = `${item.gig.title} - ${item.tier.name}`.slice(0, 15).concat("...");

    return (
      <SidebarItem
        icon={<Home size={20} />}
        text={trimTitle}
        open={open}
        id={item.id}
        key={i}
        isMobile={isMobileOpen}
        onItemClick={() => setIsMobileOpen(false)}
      />
    );
  });

  return (
    <div
      className={`
        bg-ring/20 
        dark:bg-muted-foreground 
        text-background 
        dark:text-foreground 
        h-dvh 
        p-4 
        transition-all 
        duration-300 flex flex-col
        fixed md:relative z-50 top-0 left-0 mr-2
        ${open ? "w-60" : "w-16"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setOpen(!open)}
          className="text-gray-300 hover:text-foreground"
        >
          {open ? "⏪" : "⏩"}
        </button>

        <button
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden text-gray-300 hover:text-foreground"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex flex-col gap-4 flex-1">
        {items}
      </nav>
    </div>
  );
};

function SidebarItem({
  icon,
  text,
  open,
  id,
  isMobile,
  onItemClick
}: SidebarItemProps & { onItemClick?: () => void }) {
  const { actions, state } = useContext(TransactionContext);

  const handleClick = () => {
    actions.setCurrentTransaction(id);
    if (isMobile && onItemClick) {
      onItemClick();
    }
  };

  return (
    <div
      className={`
        flex 
        items-center 
        gap-3 
        p-2 
        rounded-md 
        hover:bg-ring 
        cursor-pointer 
        overflow-hidden 
        transition-all 
        duration-300
        ${state.currentTransaction?.id == id ?
          'bg-accent' :
          "text-muted-foreground dark:text-foreground"
        }
      `}
      onClick={handleClick}
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