import Image from '@/components/UI/Image';
import Link from 'next/link';
import React from 'react';

export default function Footer() {
  return (
    <div className="text-foreground h-auto min-h-[300px]">
      <footer
        className="
          bg-background 
          text-muted-foreground 
          dark:text-accent-foreground/50
          px-4 
          sm:px-6 
          lg:px-8 
          py-8 
          sm:py-10 
          lg:py-12
        ">
        <div
          className="
        max-w-7xl 
        mx-auto 
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-4 
        gap-6 
        sm:gap-8
      "
        >
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="w-full flex flex-row items-center">
              <Image
                src="/Logo_RF.svg"
                className="w-10 sm:w-15 lg:w-15"
                alt="Logo-RedFreelance"
              />
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground ml-2 sm:ml-3">
                RedFreelance
              </h2>
            </div>
            <p
              className="
                mt-2 
                sm:mt-3 
                text-xs 
                sm:text-sm 
                text-muted-foreground 
                dark:text-accent-foreground/50
              ">
              Conectamos freelancers con clientes para proyectos digitales de calidad.
            </p>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
              Explorar
            </h3>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/gigs" className="hover:text-primary transition-colors">
                  Buscar trabajos
                </Link>
              </li>
              <li>
                <Link href="/publish" className="hover:text-primary transition-colors">
                  Publicar un servicio
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-primary transition-colors">
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary transition-colors">
                  Precios y membresías
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
              Comunidad
            </h3>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/blog"
                  className="hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/success"
                  className="hover:text-primary transition-colors"
                >
                  Historias de éxito
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-primary transition-colors"
                >
                  Centro de ayuda
                </Link>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-foreground font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
              Contacto
            </h3>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <li className="flex flex-col sm:flex-row sm:items-center">
                <span className="mb-1 sm:mb-0">Email:</span>
                <Link
                  href="mailto:soporte@redfreelance.com"
                  className="
                    text-primary 
                    hover:text-primary/80 
                    ml-0 
                    sm:ml-1 
                    transition-colors 
                    break-all
                  ">
                  soporte@redfreelance.com
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Formulario de contacto
                </Link>
              </li>
              <li className="flex space-x-3 mt-2 sm:mt-3">
                <Link
                  href="#"
                  className="hover:text-primary transition-colors text-xs sm:text-sm"
                >
                  LinkedIn
                </Link>
                <Link
                  href="#"
                  className="hover:text-primary transition-colors text-xs sm:text-sm"
                >
                  Instagram
                </Link>
                <Link
                  href="#"
                  className="hover:text-primary transition-colors text-xs sm:text-sm"
                >
                  Twitter
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="
        border-t 
        border-muted 
        mt-6 
        sm:mt-8 
        pt-4 
        text-center 
        text-xs 
        sm:text-sm 
        text-muted-foreground
      "
        >
          © {new Date().getFullYear()} RedFreelance. Todos los derechos reservados.
        </div>
      </footer>
    </div>

  );
}