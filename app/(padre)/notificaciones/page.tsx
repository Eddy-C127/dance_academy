'use client'

import { motion } from 'framer-motion'
import { Calendar, Star, CreditCard, Award } from 'lucide-react'

interface Notification {
    id: number
    type: 'event' | 'report' | 'payment' | 'achievement'
    title: string
    message: string
    time: string
    read: boolean
}

const notifications: Notification[] = [
    {
        id: 1,
        type: 'achievement',
        title: '¡Nuevo Logro!',
        message: 'Ana desbloqueó "Reina de la Disciplina"',
        time: 'Hace 2 horas',
        read: false
    },
    {
        id: 2,
        type: 'report',
        title: 'Nuevo Reporte',
        message: 'Claudia Martínez envió un reporte de Ana',
        time: 'Hace 5 horas',
        read: false
    },
    {
        id: 3,
        type: 'payment',
        title: 'Pago Próximo',
        message: 'Mensualidad Febrero vence en 5 días',
        time: 'Ayer',
        read: false
    },
    {
        id: 4,
        type: 'event',
        title: 'Recordatorio',
        message: 'Recital de Primavera en 6 semanas',
        time: 'Hace 2 días',
        read: true
    },
    {
        id: 5,
        type: 'report',
        title: 'Reporte Semanal',
        message: 'Resumen de la semana disponible',
        time: 'Hace 3 días',
        read: true
    }
]

const iconMap = {
    event: { icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    report: { icon: Star, color: 'text-purple-600', bg: 'bg-purple-50' },
    payment: { icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-50' },
    achievement: { icon: Award, color: 'text-pink-600', bg: 'bg-pink-50' }
}

export default function NotificacionesPage() {
    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <div className="px-4 pt-6">
            {/* Header */}
            <motion.div
                className="flex items-center justify-between mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
                    {unreadCount > 0 && (
                        <p className="text-sm text-gray-500">{unreadCount} sin leer</p>
                    )}
                </div>
                <motion.button
                    className="text-sm font-medium text-purple-600"
                    whileTap={{ scale: 0.95 }}
                >
                    Marcar todas leídas
                </motion.button>
            </motion.div>

            {/* Notifications List */}
            <div className="space-y-3">
                {notifications.map((notif, idx) => {
                    const config = iconMap[notif.type]
                    const Icon = config.icon

                    return (
                        <motion.div
                            key={notif.id}
                            className={`card p-4 flex items-start gap-3 ${!notif.read ? 'border-l-4 border-purple-500' : ''}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <div className={`p-2.5 rounded-xl ${config.bg}`}>
                                <Icon className={`w-5 h-5 ${config.color}`} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className={`font-semibold ${!notif.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                            {notif.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">{notif.message}</p>
                                    </div>
                                    {!notif.read && (
                                        <span className="w-2.5 h-2.5 bg-purple-500 rounded-full flex-shrink-0 mt-1" />
                                    )}
                                </div>
                                <p className="text-xs text-gray-400 mt-2">{notif.time}</p>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Empty State (hidden for demo) */}
            {notifications.length === 0 && (
                <motion.div
                    className="text-center py-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="text-6xl mb-4">🔔</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Sin notificaciones
                    </h3>
                    <p className="text-gray-500">
                        Aquí aparecerán tus notificaciones
                    </p>
                </motion.div>
            )}
        </div>
    )
}
