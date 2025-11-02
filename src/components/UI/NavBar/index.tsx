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
import useUser from "@/context/User/useUser";

export function NavBar() {
  const { data: session } = useSession();
  const { state: userState } = useUser();

  return (
    <div className="w-full bg-background z-50">
      {/* Desktop */}
      <div className="hidden md:flex items-center w-full px-4 pt-4">
        <div className="flex-1 flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/">
                    <Image alt="RedFreelance Home" src="/Logo_RF_sm.svg" className="w-10 ml-2" />
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <NavigationMenu className="flex-1">
            <NavigationMenuList className="flex items-center gap-4">
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
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex-1 max-w-[70%] mx-auto">
            <SearchBar />
          </div>
        </div>

        <NavigationMenu>
          <NavigationMenuList className="flex items-center gap-4">
            {session && (
              <>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/profile">
                      Perfil
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={`${navigationMenuTriggerStyle()} text-primary font-medium`}
                  >
                    <span>CLP {userState.userData.balance}</span>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </>
            )}

            <NavigationMenuItem>
              <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
                {session ? "Sign Out" : "Sign In"}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="p-4 min-w-[200px]">
                  <UiLoginBtn />
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="md:hidden">
        <div className="flex items-center justify-between w-full px-4 pt-4 pb-2">
          <div>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/">
                      <Image alt="RedFreelance Home" src="/Logo_RF_sm.svg" className="w-8" />
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-2">
            {session && (
              <>
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuLink
                        asChild
                        className={`${navigationMenuTriggerStyle()} text-primary font-medium text-sm`}
                      >
                        <span>${userState.userData.balance}</span>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>

                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
                        👤
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="p-4 min-w-[150px]">
                          <div className="space-y-2">
                            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                              <Link href="/profile" className="block w-full text-center">
                                Mi Perfil
                              </Link>
                            </NavigationMenuLink>
                            <div className="pt-2 border-t">
                              <UiLoginBtn />
                            </div>
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </>
            )}

            {!session && (
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
                      Entrar
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="p-4 min-w-[200px]">
                        <UiLoginBtn />
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            )}
          </div>
        </div>

        <div className="flex justify-center w-full px-4 pb-2">
          <div className="w-full max-w-2xl">
            <SearchBar />
          </div>
        </div>

        <div className="flex justify-center w-full px-4 pb-4">
          <NavigationMenu>
            <NavigationMenuList className="flex items-center gap-4">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm">
                  Categorías
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-2">
                    <CategoryList />
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/gig" className="text-sm">
                    Trabajos
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
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