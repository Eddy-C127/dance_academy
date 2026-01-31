# 💃 Dance Academy MVP - Sistema de Gestión

Sistema de gestión para academias de danza con arquitectura mobile-first, diseño moderno y PWA features.

![Dance Academy Demo](docs/demo.gif)

## 🎯 Características del MVP

### Rol Padre
- **Home (Feed)**: Novedades, eventos, reportes de maestras, logros desbloqueados
- **Stats**: Dashboard con tarjetas por hija, asistencia %, puntos, nivel
- **Pagos**: Resumen de saldos, lista de pagos con estados
- **Cuenta**: Perfil del tutor, lista de hijas, configuración
- **Notificaciones**: Centro de notificaciones con badges

### Rol Maestro
- **Toma de Asistencia**: Lista de estudiantes con botones de estado (Presente/Tarde/Ausente)
- **Registro de Pautas**: Evaluación de uniforme, disciplina, participación, progreso y comentarios

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Animaciones**: Framer Motion
- **Estado**: Zustand
- **Base de Datos**: SQLite + Prisma ORM
- **Autenticación**: NextAuth.js
- **Notificaciones**: Sonner (Toast)
- **Iconos**: Lucide React

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Node.js 18+ 
- npm o yarn

### Pasos

```bash
# 1. Clonar el repositorio o navegar al directorio
cd dance_academy

# 2. Instalar dependencias
npm install

# 3. Generar cliente Prisma
npx prisma generate

# 4. Crear base de datos
npx prisma db push

# 5. Poblar con datos de ejemplo
npx prisma db seed

# 6. Ejecutar servidor de desarrollo
npm run dev
```

### Acceder a la Aplicación
```
http://localhost:3000
```

## 🔐 Usuarios de Demo

| Rol | Email | Contraseña |
|-----|-------|------------|
| 👨‍👧‍👧 Padre | padre@demo.com | demo123 |
| 👩‍🏫 Maestra | maestra@demo.com | demo123 |
| 👤 Admin | admin@demo.com | demo123 |

## 📁 Estructura del Proyecto

```
dance_academy/
├── app/
│   ├── (auth)/
│   │   └── login/           # Página de login
│   ├── (padre)/
│   │   ├── home/            # Feed principal
│   │   ├── stats/           # Dashboard hijas
│   │   ├── pagos/           # Gestión de pagos
│   │   ├── cuenta/          # Perfil y settings
│   │   └── notificaciones/  # Centro de notificaciones
│   ├── (maestro)/
│   │   ├── asistencia/      # Toma de asistencia
│   │   └── pautas/          # Registro de evaluaciones
│   └── api/
│       ├── auth/            # NextAuth endpoints
│       ├── estudiantes/     # API estudiantes
│       ├── asistencias/     # API asistencias
│       ├── pautas/          # API evaluaciones
│       ├── pagos/           # API pagos
│       └── eventos/         # API eventos
├── components/
│   ├── BottomNav.tsx        # Navegación inferior
│   ├── StudentCard.tsx      # Tarjeta de estudiante
│   ├── FeedCard.tsx         # Tarjeta de feed
│   ├── ProgressRing.tsx     # Progreso circular
│   ├── StarRating.tsx       # Calificación estrellas
│   └── LoadingSpinner.tsx   # Spinner de carga
├── lib/
│   ├── prisma.ts            # Cliente Prisma singleton
│   ├── auth.ts              # Configuración NextAuth
│   └── utils.ts             # Utilidades y helpers
├── prisma/
│   ├── schema.prisma        # Esquema de BD
│   └── seed.ts              # Datos de ejemplo
└── types/
    └── next-auth.d.ts       # Tipos para NextAuth
```

## 🎨 Paleta de Colores

```css
--primary: #6C5CE7      /* Púrpura vibrante */
--secondary: #00B894    /* Verde menta */
--accent: #FD79A8       /* Rosa pastel */
--background: #F9F9FB   /* Gris claro */
--success: #00B894      /* Verde éxito */
--warning: #FDCB6E      /* Amarillo advertencia */
--error: #E74C3C        /* Rojo error */
```

## 📱 Diseño Mobile-First

- Bottom Navigation con 5 tabs
- Tarjetas con bordes redondeados (16px)
- Animaciones fluidas (Framer Motion)
- Touch feedback en botones
- Safe area para dispositivos con notch

## 🗄️ Modelos de Base de Datos

- **Usuario**: Padres, Maestros, Admins
- **Estudiante**: Alumnos de la academia
- **Asistencia**: Registro de asistencias
- **Pauta**: Evaluaciones de maestra
- **Logro**: Achievements gamificados
- **Pago**: Cargos y mensualidades
- **Evento**: Recitales, ensayos, showcases

## 📝 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter ESLint
npm run db:push      # Sincronizar esquema
npm run db:seed      # Poblar base de datos
npm run db:reset     # Reset completo de BD
```

## 🔧 Variables de Entorno

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## ✨ Próximas Funcionalidades

- [ ] Chatbot de IA para consultas
- [ ] Integración de pagos (Stripe)
- [ ] Notificaciones push reales
- [ ] Módulo de e-learning
- [ ] Arquitectura multi-tenant
- [ ] Dashboard administrativo
- [ ] Reportes y analytics
- [ ] Calendario de eventos
- [ ] Sistema de mensajes

## 📄 Licencia

MIT License - © 2026 Dance Academy

---

Desarrollado con 💜 usando Next.js, TypeScript y Prisma
