'use client';
import React, { useContext, useState } from "react";
import { Briefcase, Menu, X, ChevronsLeft, ChevronsRight } from "lucide-react";
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
        icon={<Briefcase size={20} />}
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
        dark:bg-muted
        text-background 
        dark:text-foreground 
        outline
        rounded-r-lg
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
          className="text-gray-300 hover:text-foreground cursor-pointer"
        >
          {
            open ?
              <ChevronsLeft size={20} strokeWidth={1.5} /> :
              <ChevronsRight size={20} strokeWidth={1.5} />
          }
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

  const isActive = state.currentTransaction?.id === id;

  return (
    <div
      onClick={handleClick}
      className={`
        flex 
        items-center 
        p-2 
        rounded-md 
        cursor-pointer 
        transition-all 
        duration-300
        ${isActive
          ? 'bg-accent text-accent-foreground'
          : 'text-muted-foreground dark:text-foreground hover:bg-ring'
        }

        ${open ? "justify-start gap-3" : "justify-center"}
      `}
      title={!open ? text : ""}
    >
      <span className="flex-shrink-0">
        {icon}
      </span>

      {open && (
        <span
          className="
          whitespace-nowrap 
          overflow-hidden 
          animate-in 
          fade-in 
          zoom-in 
          duration-200
        ">
          {text}
        </span>
      )}
    </div>
  );
}