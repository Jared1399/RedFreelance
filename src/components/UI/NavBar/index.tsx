"use client";

import * as React from "react";
import Link from "next/link";
import UiLoginBtn from "@/components/UI/LoginBtn";
import { useSession } from "next-auth/react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/UI/shadcn/navigation-menu";
import CategoryList from "./CategoryList";
import Image from "../Image";
import SearchBar from "./SearchBar";


export function NavBar() {
  const { data: session } = useSession();

  const profileLink = session ? (
    <>
      <NavigationMenuItem>
        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
          <Link href="/profile">
            Perfil
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem></NavigationMenuItem>
    </>
  ) : null;


  return (
    <div>
      <NavigationMenu viewport={false} className="pt-4 px-4 z-50 w-full">
        <NavigationMenuList>

          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link href="/">
                <Image alt="RedFreelance Home" src="/Logo_RF_sm.svg" className="w-10 ml-2" />
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem></NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>Categorias</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                <CategoryList />
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>

            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link href="/gig">Trabajos</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <SearchBar />
          </NavigationMenuItem>

          <NavigationMenuItem>

            <NavigationMenuTrigger>Simple</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[200px] gap-4">
                <li>
                  <NavigationMenuLink asChild>
                    <Link href="#">Components</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="#">Documentation</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="#">Blocks</Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {profileLink}

          <NavigationMenuItem className="place-self-end">

            <NavigationMenuTrigger>{session ? "Sign Out" : "Sign In"}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[200px] gap-4">
                <li>
                  <NavigationMenuLink asChild>
                    <UiLoginBtn />
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>

          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

export function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}


export default NavBar;