"use client";

import * as React from "react";
import Link from "next/link";
import UiLoginBtn from "@/components/UI/LoginBtn";
import { useSession } from "next-auth/react";
import clsx from 'clsx';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/UI/shadcn/navigation-menu";
import useCategory from "@/context/Category/useCategory";


const CategoryList = () => {
  const { state } = useCategory({ skip: 0, limit: 4 });

  const categoryList = state.categoryList;

  const categoryComponents = categoryList.length ?
    state.categoryList.map((component) => {
      return (
        <ListItem
          key={component.id}
          title={component.name}
          href={`/categories/name/${component.name}`}
        >
          {component.description}
        </ListItem>
      );
    }) : null;

  return (
    <>{categoryComponents}</>
  );
};

const navMenuLinkCls = clsx(
  "from-muted/50",
  "to-muted",
  "flex",
  "h-full",
  "w-full",
  "flex-col",
  "justify-end",
  "rounded-md",
  "bg-linear-to-b",
  "p-6",
  "no-underline",
  "outline-hidden",
  "select-none",
  "focus:shadow-md"
);

export function NavBar() {
  const { data: session } = useSession();

  const profileLink = session ? (
    <>
      <NavigationMenuItem>
        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
          <Link href="/profile">Perfil</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem></NavigationMenuItem>
    </>
  ) : null;


  return (
    <div>
      <NavigationMenu viewport={false} className="py-4 px-4 z-50 w-full">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Home</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <Link
                      className={navMenuLinkCls}
                      href="/"
                    >
                      <div className="mt-4 mb-2 text-lg font-medium">
                        RedFreelance
                      </div>
                      <p className="text-muted-foreground text-sm leading-tight">
                        Creado por trabajadores, para trabajadores
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/docs" title="Introduction">
                  Re-usable components built using Radix UI and Tailwind CSS.
                </ListItem>
                <ListItem href="/docs/installation" title="Installation">
                  How to install dependencies and structure your app.
                </ListItem>
                <ListItem href="/docs/primitives/typography" title="Typography">
                  Styles for headings, paragraphs, lists...etc
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

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

            <NavigationMenuTrigger>List</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[300px] gap-4">
                <li>
                  <NavigationMenuLink asChild>
                    <Link href="#">
                      <div className="font-medium">Components</div>
                      <div className="text-muted-foreground">
                        Browse all components in the library.
                      </div>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="#">
                      <div className="font-medium">Documentation</div>
                      <div className="text-muted-foreground">
                        Learn how to use the library.
                      </div>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="#">
                      <div className="font-medium">Blog</div>
                      <div className="text-muted-foreground">
                        Read our latest blog posts.
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
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

function ListItem({
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