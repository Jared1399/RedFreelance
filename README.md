# RedFreelance

Marketplace de servicios freelance: perfiles con portafolio, gigs con paquetes
de precio, transacciones con pago, chat en tiempo real y blog.

Construido como proyecto personal entre 2025 y 2026 (**165 commits**, 82
componentes, 38 endpoints REST, 20 modelos de datos).

## Qué incluye

- **Gigs** con paquetes (`GigTier`), categorías many-to-many, búsqueda por
  título y filtros por categoría con paginación.
- **Perfiles** con portafolio, seguidores, likes y feedback entre usuarios.
- **Transacciones** con ciclo de vida completo: solicitud → aceptación →
  pago → cierre, con expiración automática de las vencidas.
- **Pagos** con Webpay Plus (Transbank) en modo integración, con retorno y
  verificación del resultado.
- **Chat** por transacción en tiempo real con socket.io, autenticado por token
  emitido desde el servidor Next.
- **Blog** con categorías y comentarios, notificaciones internas y avisos
  administrados desde el panel.
- **Panel de administración** para moderar usuarios, publicaciones y pagos.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Radix UI |
| Backend | Route Handlers de Next, Prisma 7 con `adapter-pg`, Zod |
| Base de datos | PostgreSQL 15 |
| Auth | NextAuth (credenciales + Google) |
| Tiempo real | socket.io (servidor aparte) |
| Pagos | Webpay Plus vía SDK de Transbank |
| Archivos | Cloudflare R2 |
| Infra | Docker Compose + PM2 para el worker |

## Arquitectura

Cuatro contenedores:

```
db      postgres:15-alpine
web     Next en modo producción (migrate deploy + seed + start)
socket  servidor socket.io en el puerto 4000
cron    PM2 ejecutando expire-transactions-cron
```

El worker de PM2 cierra las transacciones que expiran sin pago; el servidor de
socket emite los eventos de chat solo a participantes con token válido.

## Cómo correr

```bash
git clone git@github.com:Jared1399/RedFreelance.git
cd RedFreelance
cp .env.example .env        # completar credenciales

docker compose up -d db
npm install
npx prisma migrate dev
npm run prisma:seed
npm run dev                 # Next en :3000

node socketServer.js        # chat en :4000 (otra terminal)
```

O todo junto con `docker compose up --build`, usando las imágenes ya
publicadas en Docker Hub.

## Estado y limitaciones

- **Sin demo pública.** El dominio está reservado y el despliegue apagado, así
  que el repositorio es la única forma de verlo.
- **Pagos en integración (sandbox).** No procesa dinero real: el `.env.example`
  usa el código de comercio y la API key públicos del entorno de integración
  de Transbank, no credenciales productivas.
- **Sin suite de tests automatizados.** La validación de entrada se hace con
  Zod en los route handlers.
- Proyecto de una sola persona: frontend, backend, worker y despliegue.

## Licencia

Sin licencia por ahora: el código es visible, pero todos los derechos quedan
reservados al autor.
