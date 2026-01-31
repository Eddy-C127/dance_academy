'use client'

import { motion } from 'framer-motion'
import StudentCard from '@/components/StudentCard'

interface StatsClientProps {
    estudiantes: Array<{
        id: number
        nombre: string
        apellido: string
        foto: string
        especialidad: string
        nivel: string
        puntos: number
        asistencia: number
        logros: Array<{
            id: number
            nombre: string
            icono: string
            puntos: number
        }>
    }>
    leaderboard: Array<{
        id: number
        nombre: string
        apellido: string
        foto: string
        puntos: number
    }>
}

const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣']

export default function StatsClient({ estudiantes, leaderboard }: StatsClientProps) {
    return (
        <div className="px-4 pt-6">
            {/* Header */}
            <motion.h1
                className="text-2xl font-bold text-gray-900 mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                Mis Hijas
            </motion.h1>

            {/* Student Cards */}
            <div className="space-y-4 mb-8">
                {estudiantes.map((estudiante, idx) => (
                    <StudentCard
                        key={estudiante.id}
                        student={estudiante}
                        delay={idx * 0.1}
                    />
                ))}
            </div>

            {/* Achievements Section */}
            {estudiantes.some(e => e.logros.length > 0) && (
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                        🏆 Logros Recientes
                    </h2>
                    <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                        {estudiantes.flatMap(e =>
                            e.logros.map(logro => (
                                <motion.div
                                    key={logro.id}
                                    className="flex-shrink-0 w-24 card p-3 text-center"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="text-3xl mb-1">{logro.icono}</div>
                                    <p className="text-xs font-medium text-gray-600 line-clamp-2">
                                        {logro.nombre}
                                    </p>
                                    <p className="text-xs text-purple-600 font-semibold mt-1">
                                        +{logro.puntos} pts
                                    </p>
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>
            )}

            {/* Leaderboard */}
            <motion.div
                className="card p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    🏅 Top 5 de la Semana
                </h2>
                <div className="space-y-3">
                    {leaderboard.map((student, idx) => (
                        <motion.div
                            key={student.id}
                            className={`
                flex items-center gap-3 p-3 rounded-xl
                ${idx === 0 ? 'bg-gradient-to-r from-amber-50 to-yellow-50' :
                                    idx === 1 ? 'bg-gradient-to-r from-gray-50 to-slate-50' :
                                        idx === 2 ? 'bg-gradient-to-r from-orange-50 to-amber-50' :
                                            'bg-gray-50'}
              `}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + idx * 0.1 }}
                        >
                            <span className="text-2xl">{medals[idx]}</span>
                            <img
                                src={student.foto}
                                alt={student.nombre}
                                className="w-9 h-9 rounded-full"
                            />
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                    {student.nombre} {student.apellido.charAt(0)}.
                                </p>
                            </div>
                            <span className={`
                font-bold
                ${idx === 0 ? 'text-amber-600' :
                                    idx === 1 ? 'text-gray-500' :
                                        idx === 2 ? 'text-orange-600' :
                                            'text-gray-600'}
              `}>
                                {student.puntos} pts
                            </span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}
