import Image from '@/components/UI/Image';
import React from 'react';

export default function Footer() {
  return (
    <div className='text-white mt-8 h-[300px]'>
      <footer className="bg-neutral-900 text-gray-300 px-8 py-12 mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

          <div>
            <div className='w-full flex flex-row'>
              <Image src='/Logo_RF.svg' className='w-15' alt='Logo-RedFreelance' />
              <h2 className="text-xl font-bold text-white mt-auto ml-2">RedFreelance</h2>
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Conectamos freelancers con clientes para proyectos digitales de calidad.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Explorar</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/gigs" className="hover:text-amber-700">Buscar trabajos</a></li>
              <li><a href="/publish" className="hover:text-amber-700">Publicar un servicio</a></li>
              <li><a href="/how-it-works" className="hover:text-amber-700">Cómo funciona</a></li>
              <li><a href="/pricing" className="hover:text-amber-700">Precios y membresías</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Comunidad</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/blog" className="hover:text-amber-700">Blog</a></li>
              <li><a href="/success" className="hover:text-amber-700">Historias de éxito</a></li>
              <li><a href="/faq" className="hover:text-amber-700">Centro de ayuda</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                Email:
                <a
                  href="mailto:soporte@redfreelance.com"
                  className="text-amber-600 hover:text-amber-700 ml-1"
                >
                  soporte@redfreelance.com
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-amber-700">Formulario de contacto</a>
              </li>
              <li className="flex space-x-3 mt-2">
                <a href="#" className="hover:text-amber-700">LinkedIn</a>
                <a href="#" className="hover:text-amber-700">Instagram</a>
                <a href="#" className="hover:text-amber-700">Twitter</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} RedFreelance. Todos los derechos reservados.
        </div>
      </footer>

    </div>
  );
}
