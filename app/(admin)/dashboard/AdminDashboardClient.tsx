'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
    Users,
    DollarSign,
    Clock,
    Calendar,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    AlertCircle,
    TrendingUp,
    BookOpen,
    ChevronRight,
    Phone,
    Mail,
    LogOut,
    Home
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { formatCurrency, formatShortDate, getDaysUntil } from '@/lib/utils'

interface AdminDashboardClientProps {
    user: {
        name: string
        avatar: string | null
    }
    maestros: Array<{
        id: number
        nombre: string
        avatar: string | null
        clasesImpartidas: number
        horasTrabajadas: number
        pagoSemanal: number
        pautasCreadas: number
    }>
    eventos: Array<{
        id: number
        nombre: string
        tipo: string
        fecha: Date
        ubicacion: string
    }>
    pagosVencidos: Array<{
        id: number
        concepto: string
        monto: number
        fechaVenc: Date
        tutorNombre: string
        tutorEmail: string
        tutorTelefono: string | null
        estudianteNombre: string | null
    }>
    asistenciaResumen: {
        presentes: number
        tardes: number
        ausentes: number
        justificados: number
        total: number
    }
    totalEstudiantes: number
    totalClasesSemana: number
    fechaSemana: {
        inicio: string
        fin: string
    }
}

export default function AdminDashboardClient({
    user,
    maestros,
    eventos,
    pagosVencidos,
    asistenciaResumen,
    totalEstudiantes,
    totalClasesSemana,
    fechaSemana
}: AdminDashboardClientProps) {
    const totalHorasSemana = maestros.reduce((sum, m) => sum + m.horasTrabajadas, 0)
    const totalPagosSemana = maestros.reduce((sum, m) => sum + m.pagoSemanal, 0)
    const totalPagosVencidos = pagosVencidos.reduce((sum, p) => sum + p.monto, 0)

    const asistenciaPorcentaje = asistenciaResumen.total > 0
        ? Math.round((asistenciaResumen.presentes / asistenciaResumen.total) * 100)
        : 0

    const formatWeekRange = () => {
        const inicio = new Date(fechaSemana.inicio)
        const fin = new Date(fechaSemana.fin)
        return `${inicio.getDate()}/${inicio.getMonth() + 1} - ${fin.getDate()}/${fin.getMonth() + 1}`
    }

    return (
        <div className="min-h-screen pb-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-6 pt-8 pb-6">
                <motion.div
                    className="flex items-center justify-between mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-3">
                        <img
                            src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'}
                            alt={user.name}
                            className="w-12 h-12 rounded-full ring-2 ring-white/20"
                        />
                        <div>
                            <p className="text-sm text-slate-300">Panel de Administración</p>
                            <h1 className="text-xl font-bold">{user.name}</h1>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/home">
                            <motion.button
                                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition"
                                whileTap={{ scale: 0.95 }}
                            >
                                <Home className="w-5 h-5" />
                            </motion.button>
                        </Link>
                        <motion.button
                            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition"
                            whileTap={{ scale: 0.95 }}
                            onClick={() => signOut({ callbackUrl: '/login' })}
                        >
                            <LogOut className="w-5 h-5" />
                        </motion.button>
                    </div>
                </motion.div>

                {/* Week indicator */}
                <motion.div
                    className="flex items-center gap-2 text-sm text-slate-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <Calendar className="w-4 h-4" />
                    <span>Semana: {formatWeekRange()}</span>
                </motion.div>
            </div>

            <div className="px-4 -mt-4">
                {/* Quick Stats Grid */}
                <motion.div
                    className="grid grid-cols-2 gap-3 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-purple-100 rounded-xl">
                                <Users className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{totalEstudiantes}</p>
                        <p className="text-xs text-gray-500">Alumnas Registradas</p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-blue-100 rounded-xl">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{totalClasesSemana}</p>
                        <p className="text-xs text-gray-500">Clases Esta Semana</p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-green-100 rounded-xl">
                                <Clock className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{totalHorasSemana}h</p>
                        <p className="text-xs text-gray-500">Horas Trabajadas</p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-amber-100 rounded-xl">
                                <DollarSign className="w-5 h-5 text-amber-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPagosSemana)}</p>
                        <p className="text-xs text-gray-500">Nómina Semana</p>
                    </div>
                </motion.div>

                {/* Attendance Summary */}
                <motion.div
                    className="bg-white rounded-2xl p-5 shadow-sm mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-gray-900">📊 Resumen de Asistencia</h2>
                        <span className="badge badge-primary">{asistenciaPorcentaje}% Asistencia</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        <div className="text-center p-3 bg-green-50 rounded-xl">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto mb-1" />
                            <p className="text-lg font-bold text-green-700">{asistenciaResumen.presentes}</p>
                            <p className="text-xs text-green-600">Presentes</p>
                        </div>
                        <div className="text-center p-3 bg-amber-50 rounded-xl">
                            <Clock className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                            <p className="text-lg font-bold text-amber-700">{asistenciaResumen.tardes}</p>
                            <p className="text-xs text-amber-600">Tardes</p>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-xl">
                            <XCircle className="w-5 h-5 text-red-600 mx-auto mb-1" />
                            <p className="text-lg font-bold text-red-700">{asistenciaResumen.ausentes}</p>
                            <p className="text-xs text-red-600">Ausentes</p>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-xl">
                            <AlertCircle className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                            <p className="text-lg font-bold text-blue-700">{asistenciaResumen.justificados}</p>
                            <p className="text-xs text-blue-600">Justificados</p>
                        </div>
                    </div>
                </motion.div>

                {/* Teachers Section */}
                <motion.div
                    className="bg-white rounded-2xl p-5 shadow-sm mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="font-semibold text-gray-900 mb-4">👩‍🏫 Horas de Maestros</h2>

                    {maestros.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No hay maestros registrados</p>
                    ) : (
                        <div className="space-y-3">
                            {maestros.map((maestro) => (
                                <div
                                    key={maestro.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={maestro.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher'}
                                            alt={maestro.nombre}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-900">{maestro.nombre}</p>
                                            <p className="text-xs text-gray-500">
                                                {maestro.clasesImpartidas} clases • {maestro.pautasCreadas} pautas
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">{maestro.horasTrabajadas}h</p>
                                        <p className="text-xs text-green-600">{formatCurrency(maestro.pagoSemanal)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-sm text-gray-500">Total Nómina Semanal</span>
                        <span className="text-lg font-bold text-green-600">{formatCurrency(totalPagosSemana)}</span>
                    </div>
                </motion.div>

                {/* Overdue Payments */}
                <motion.div
                    className="bg-white rounded-2xl p-5 shadow-sm mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-gray-900">⚠️ Pagos Vencidos</h2>
                        {pagosVencidos.length > 0 && (
                            <span className="badge badge-error">{formatCurrency(totalPagosVencidos)}</span>
                        )}
                    </div>

                    {pagosVencidos.length === 0 ? (
                        <div className="text-center py-6">
                            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                            <p className="text-gray-500">No hay pagos vencidos</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pagosVencidos.map((pago) => (
                                <div
                                    key={pago.id}
                                    className="p-4 bg-red-50 border border-red-100 rounded-xl"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="font-medium text-gray-900">{pago.tutorNombre}</p>
                                            <p className="text-sm text-gray-600">{pago.concepto}</p>
                                            {pago.estudianteNombre && (
                                                <p className="text-xs text-gray-500">Alumna: {pago.estudianteNombre}</p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-red-600">{formatCurrency(pago.monto)}</p>
                                            <p className="text-xs text-red-500">
                                                Venció hace {Math.abs(getDaysUntil(pago.fechaVenc))} días
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center flex-wrap gap-2 mt-3 pt-3 border-t border-red-100">
                                        {pago.tutorTelefono && (
                                            <>
                                                <a
                                                    href={`tel:${pago.tutorTelefono}`}
                                                    className="flex items-center gap-1 text-xs text-gray-600 hover:text-purple-600"
                                                >
                                                    <Phone className="w-3 h-3" />
                                                    {pago.tutorTelefono}
                                                </a>
                                                <a
                                                    href={`https://wa.me/521${pago.tutorTelefono.replace(/\D/g, '')}?text=${encodeURIComponent(
                                                        `¡Hola ${pago.tutorNombre}! 👋 Esperamos que esté muy bien. Le escribimos de Dance Academy para recordarle amablemente que tiene pendiente el pago de ${formatCurrency(pago.monto)} por concepto de: ${pago.concepto}. Quedamos a sus órdenes para cualquier duda. ¡Saludos! 💃`
                                                    )}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-full transition-colors ml-auto"
                                                >
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                    </svg>
                                                    Enviar recordatorio
                                                </a>
                                            </>
                                        )}
                                        <a
                                            href={`mailto:${pago.tutorEmail}?subject=Recordatorio amable de pago - Dance Academy&body=${encodeURIComponent(
                                                `¡Hola ${pago.tutorNombre}!\n\nEsperamos que se encuentre muy bien. Le escribimos de Dance Academy para recordarle amablemente que tiene pendiente el pago de ${formatCurrency(pago.monto)} por concepto de: ${pago.concepto}.\n\nQuedamos a sus órdenes para cualquier duda o si necesita algún apoyo.\n\n¡Saludos cordiales!\nDance Academy 💃`
                                            )}`}
                                            className="flex items-center gap-1 text-xs text-gray-600 hover:text-purple-600"
                                        >
                                            <Mail className="w-3 h-3" />
                                            {pago.tutorEmail}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Upcoming Events */}
                <motion.div
                    className="bg-white rounded-2xl p-5 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-gray-900">📅 Próximos Eventos</h2>
                    </div>

                    {eventos.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No hay eventos próximos</p>
                    ) : (
                        <div className="space-y-3">
                            {eventos.map((evento) => (
                                <div
                                    key={evento.id}
                                    className="flex items-center justify-between p-3 bg-purple-50 rounded-xl"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex flex-col items-center justify-center">
                                            <span className="text-xs text-purple-600 font-medium">
                                                {new Date(evento.fecha).toLocaleDateString('es-MX', { month: 'short' }).toUpperCase()}
                                            </span>
                                            <span className="text-lg font-bold text-purple-700">
                                                {new Date(evento.fecha).getDate()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{evento.nombre}</p>
                                            <p className="text-xs text-gray-500">{evento.ubicacion}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full capitalize">
                                            {evento.tipo}
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1">
                                            En {getDaysUntil(evento.fecha)} días
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
