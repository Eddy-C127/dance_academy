'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Calendar, MessageCircle, BarChart2 } from 'lucide-react'

interface StudentCardProps {
    student: {
        id: number
        nombre: string
        apellido?: string
        foto: string
        especialidad: string
        nivel: string
        puntos: number
        asistencia: number
    }
    delay?: number
}

function getLevel(puntos: number): { name: string; color: string } {
    if (puntos >= 1000) return { name: 'Oro', color: 'text-yellow-500' }
    if (puntos >= 500) return { name: 'Plata', color: 'text-gray-400' }
    return { name: 'Bronce', color: 'text-amber-700' }
}

export default function StudentCard({ student, delay = 0 }: StudentCardProps) {
    const level = getLevel(student.puntos)
    const trend = student.asistencia >= 90 ? 'up' : student.asistencia >= 70 ? 'stable' : 'down'

    return (
        <motion.div
            className="card p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                    <img
                        src={student.foto}
                        alt={student.nombre}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-purple-100"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-[8px] text-white">✓</span>
                    </div>
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                        {student.nombre} {student.apellido}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="badge badge-primary text-xs">
                            {student.especialidad}
                        </span>
                        <span className="text-xs text-gray-500">
                            {student.nivel}
                        </span>
                    </div>
                </div>
                <motion.div
                    className="flex items-center gap-1"
                    whileHover={{ scale: 1.1 }}
                >
                    <span className="text-2xl">🔥</span>
                    <span className="text-xs font-bold text-gray-700">5</span>
                </motion.div>
            </div>

            {/* Stats Pills */}
            <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <span className="text-lg">📅</span>
                    </div>
                    <span className="text-xs text-gray-500 block">Asistencia</span>
                    <div className="flex items-center justify-center gap-1">
                        <span className={`text-sm font-bold ${student.asistencia >= 90 ? 'text-green-600' :
                            student.asistencia >= 70 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                            {student.asistencia}%
                        </span>
                        {trend === 'up' && (
                            <TrendingUp className="w-3 h-3 text-green-500" />
                        )}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <span className="text-lg">⭐</span>
                    </div>
                    <span className="text-xs text-gray-500 block">Puntos</span>
                    <span className="text-sm font-bold text-gray-800">{student.puntos.toLocaleString()}</span>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-pink-100/50 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <span className="text-lg">🏆</span>
                    </div>
                    <span className="text-xs text-gray-500 block">Nivel</span>
                    <span className={`text-sm font-bold ${level.color}`}>{level.name}</span>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
                <motion.button
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium text-gray-700"
                    whileTap={{ scale: 0.98 }}
                >
                    <Calendar className="w-4 h-4" />
                    Agenda
                </motion.button>
                <motion.button
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium text-gray-700"
                    whileTap={{ scale: 0.98 }}
                >
                    <MessageCircle className="w-4 h-4" />
                    Chat
                </motion.button>
                <motion.button
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors text-sm font-medium text-purple-700"
                    whileTap={{ scale: 0.98 }}
                >
                    <BarChart2 className="w-4 h-4" />
                    Progreso
                </motion.button>
            </div>
        </motion.div>
    )
}
