# La Aldea Burguer — Registro de ventas

Sistema web para registrar ventas diarias de un restaurante local, consultar el detalle de cada ticket y visualizar estadísticas en un dashboard responsive (móvil y escritorio).

## Stack

- **Next.js 16** (App Router) + TypeScript
- **PostgreSQL** con **Prisma ORM**
- **Tailwind CSS**
- Despliegue recomendado en **Vercel**

## Modelo de datos

El esquema replica el diagrama entregado:

| Tabla | Campos principales |
|-------|-------------------|
| `productos` | idProducto, nombreProducto, precioProducto, tipoProducto |
| `venta` | idVenta, fechaVenta, totalVenta |
| `detalleVenta` | idDetalle, idVenta, idProducto, cantidadProducto, precioUnitario, subtotalVenta |

## Arquitectura

```
src/
├── app/
│   ├── page.tsx                 # Dashboard
│   ├── ventas/nueva/page.tsx    # Registrar venta
│   ├── ventas/[id]/page.tsx     # Detalle de venta
│   └── api/                     # REST API
├── components/                  # UI reutilizable
├── lib/
│   ├── prisma.ts                # Cliente de base de datos
│   └── services/                # Lógica de negocio
└── types/                       # Tipos compartidos
```

## Requisitos previos

- Node.js 20+
- Base de datos PostgreSQL (local, [Neon](https://neon.tech), [Supabase](https://supabase.com) o Vercel Postgres)

## Configuración local

1. Instala dependencias:

```bash
npm install
```

2. Copia las variables de entorno:

```bash
cp .env.example .env
```

3. Configura `DATABASE_URL` en `.env` con tu cadena de conexión PostgreSQL.

4. Crea las tablas y carga datos de ejemplo:

```bash
npm run db:push
npm run db:seed
```

5. Inicia el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Funcionalidades

### Dashboard (`/`)
- Producto más vendido
- Venta más alta registrada
- Ingreso total acumulado
- Gráfica de ventas por día de la semana
- Tabla de ventas recientes con acceso al detalle

### Nueva venta (`/ventas/nueva`)
- Selección de fecha
- Producto y cantidad
- Varias líneas por ticket
- Cálculo automático de subtotales y total

### Detalle de venta (`/ventas/[id]`)
- Información del ticket
- Listado de productos vendidos con precios y subtotales

## Despliegue en Vercel

1. Sube el repositorio a GitHub.
2. Importa el proyecto en [Vercel](https://vercel.com).
3. Crea una base PostgreSQL (Neon o Vercel Postgres).
4. Agrega la variable de entorno `DATABASE_URL` en Vercel.
5. Ejecuta migraciones/seed contra la base en producción:

```bash
npm run db:push
npm run db:seed
```

6. Despliega. El script `postinstall` generará el cliente Prisma automáticamente.

## API disponible

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/productos` | Lista de productos |
| GET | `/api/ventas` | Lista de ventas |
| POST | `/api/ventas` | Registrar venta |
| GET | `/api/ventas/:id` | Detalle de venta |
| GET | `/api/estadisticas` | Estadísticas del dashboard |
