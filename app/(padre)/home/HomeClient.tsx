'use client'

import { motion } from 'framer-motion'
import FeedCard from '@/components/FeedCard'
import { formatCurrency, getDaysUntil } from '@/lib/utils'
import { Bell, ClipboardCheck, FileText, ChevronRight, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'

interface HomeClientProps {
    user: {
        name: string
        avatar: string | null
        role?: string
    }
    eventos: Array<{
        id: number
        nombre: string
        tipo: string
        fecha: Date
        ubicacion: string
        descripcion: string | null
        banner: string | null
    }>
    pautas: Array<{
        id: number
        fecha: Date
        disciplina: number
        comentarios: string | null
        estudiante: {
            nombre: string
        }
        maestro: {
            nombre: string
        }
    }>
    logros: Array<{
        id: number
        nombre: string
        descripcion: string
        icono: string
        puntos: number
        fecha: Date
        estudiante: {
            nombre: string
        }
    }>
    pagos: Array<{
        id: number
        concepto: string
        monto: number
        fechaVenc: Date
        estado: string
        estudianteNombre: string | null
    }>
}

export default function HomeClient({ user, eventos, pautas, logros, pagos }: HomeClientProps) {
    const urgentPayment = pagos.find(p => getDaysUntil(p.fechaVenc) <= 7)

    return (
        <div className="px-4 pt-6">
            {/* Header */}
            <motion.div
                className="flex items-center justify-between mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-3">
                    <img
                        src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
                        alt={user.name}
                        className="w-12 h-12 rounded-full ring-2 ring-purple-100"
                    />
                    <div>
                        <p className="text-sm text-gray-500">Hola,</p>
                        <h1 className="text-xl font-bold text-gray-900">{user.name.split(' ')[0]} 👋</h1>
                    </div>
                </div>
                <motion.button
                    className="relative p-3 bg-white rounded-full shadow-sm"
                    whileTap={{ scale: 0.95 }}
                >
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                </motion.button>
            </motion.div>

            {/* Page Title */}
            <motion.h2
                className="text-2xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                Novedades
            </motion.h2>

            {/* Teacher Quick Actions */}
            {(user.role === 'maestro' || user.role === 'admin') && (
                <motion.div
                    className="grid grid-cols-2 gap-3 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <Link href="/asistencia">
                        <motion.div
                            className="p-4 rounded-2xl shadow-md bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <ClipboardCheck className="w-6 h-6" />
                                <ChevronRight className="w-4 h-4 opacity-70" />
                            </div>
                            <h3 className="font-semibold">Tomar Asistencia</h3>
                            <p className="text-xs text-white/70">Registrar asistencia del día</p>
                        </motion.div>
                    </Link>
                    <Link href="/pautas">
                        <motion.div
                            className="p-4 rounded-2xl shadow-md bg-gradient-to-br from-pink-500 to-rose-500 text-white"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <FileText className="w-6 h-6" />
                                <ChevronRight className="w-4 h-4 opacity-70" />
                            </div>
                            <h3 className="font-semibold">Registro de Pautas</h3>
                            <p className="text-xs text-white/70">Evaluar estudiantes</p>
                        </motion.div>
                    </Link>
                </motion.div>
            )}

            {/* Admin Dashboard Quick Access */}
            {user.role === 'admin' && (
                <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Link href="/dashboard">
                        <motion.div
                            className="p-4 rounded-2xl shadow-md bg-gradient-to-br from-slate-700 to-slate-900 text-white"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/10 rounded-xl">
                                        <LayoutDashboard className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Panel de Administración</h3>
                                        <p className="text-xs text-white/70">Ver métricas, pagos y estadísticas</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 opacity-70" />
                            </div>
                        </motion.div>
                    </Link>
                </motion.div>
            )}

            {/* Feed */}
            <div className="space-y-4">
                {/* Event Card */}
                {eventos[0] && (
                    <FeedCard
                        type="event"
                        title={eventos[0].nombre}
                        date={eventos[0].fecha}
                        imageUrl={eventos[0].banner || undefined}
                        action={{
                            label: 'Confirmar Asistencia',
                            onClick: () => { }
                        }}
                        delay={0.1}
                    />
                )}

                {/* Report Card */}
                {pautas[0] && (
                    <FeedCard
                        type="report"
                        title={`Reporte de ${pautas[0].estudiante.nombre}`}
                        subtitle={`Por ${pautas[0].maestro.nombre}`}
                        description={pautas[0].comentarios || 'Sin comentarios'}
                        date={pautas[0].fecha}
                        rating={pautas[0].disciplina}
                        delay={0.2}
                    />
                )}

                {/* Achievement Card */}
                {logros[0] && (
                    <FeedCard
                        type="achievement"
                        title={logros[0].nombre}
                        subtitle={`¡${logros[0].estudiante.nombre} lo logró!`}
                        description={logros[0].descripcion}
                        icon={logros[0].icono}
                        points={logros[0].puntos}
                        date={logros[0].fecha}
                        delay={0.3}
                    />
                )}

                {/* More Achievements */}
                {logros[1] && (
                    <FeedCard
                        type="achievement"
                        title={logros[1].nombre}
                        subtitle={`¡${logros[1].estudiante.nombre} lo logró!`}
                        description={logros[1].descripcion}
                        icon={logros[1].icono}
                        points={logros[1].puntos}
                        date={logros[1].fecha}
                        delay={0.35}
                    />
                )}

                {/* Payment Alert */}
                {urgentPayment && (
                    <FeedCard
                        type="alert"
                        title="Pago Próximo a Vencer"
                        description={`${urgentPayment.concepto} - ${formatCurrency(urgentPayment.monto)} vence ${getDaysUntil(urgentPayment.fechaVenc) < 0 ? 'hace ' + Math.abs(getDaysUntil(urgentPayment.fechaVenc)) + ' días' : 'en ' + getDaysUntil(urgentPayment.fechaVenc) + ' días'}`}
                        date={urgentPayment.fechaVenc}
                        action={{
                            label: 'Pagar Ahora',
                            onClick: () => { }
                        }}
                        delay={0.4}
                    />
                )}

                {/* Upcoming Event */}
                {eventos[1] && (
                    <FeedCard
                        type="event"
                        title={eventos[1].nombre}
                        date={eventos[1].fecha}
                        description={eventos[1].descripcion || undefined}
                        delay={0.5}
                    />
                )}
            </div>
        </div>
    )
}
