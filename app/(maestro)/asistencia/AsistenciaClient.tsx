'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Check, X, Clock, Save, ArrowLeft, ChevronDown, Users } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Estudiante {
    id: number
    nombre: string
    apellido: string
    foto: string
    asistencia: string | null
}

interface AsistenciaClientProps {
    estudiantes: Estudiante[]
    clase: string
    maestroId: number
}

type AttendanceStatus = 'presente' | 'ausente' | 'tarde' | null

export default function AsistenciaClient({ estudiantes, clase, maestroId }: AsistenciaClientProps) {
    const router = useRouter()
    const [attendance, setAttendance] = useState<Record<number, AttendanceStatus>>(
        estudiantes.reduce((acc, est) => ({
            ...acc,
            [est.id]: est.asistencia as AttendanceStatus
        }), {})
    )
    const [saving, setSaving] = useState(false)
    const [showClassSelector, setShowClassSelector] = useState(false)

    const clases = [
        'Ballet Intermedio - Grupo A',
        'Ballet Principiante - Grupo B',
        'Contemporáneo Avanzado',
        'Jazz - Grupo único'
    ]

    const handleAttendance = (studentId: number, status: AttendanceStatus) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: prev[studentId] === status ? null : status
        }))

        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(10)
        }
    }

    const saveAttendance = async () => {
        setSaving(true)

        try {
            const promises = Object.entries(attendance)
                .filter(([_, status]) => status !== null)
                .map(([studentId, status]) =>
                    fetch('/api/asistencias', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            estudianteId: parseInt(studentId),
                            estado: status,
                            clase
                        })
                    })
                )

            await Promise.all(promises)

            toast.success('¡Asistencia guardada!', {
                description: `${presentes} presentes, ${ausentes} ausentes, ${tardes} tardes`
            })

            router.refresh()
        } catch (error) {
            toast.error('Error al guardar asistencia')
        } finally {
            setSaving(false)
        }
    }

    const presentes = Object.values(attendance).filter(s => s === 'presente').length
    const ausentes = Object.values(attendance).filter(s => s === 'ausente').length
    const tardes = Object.values(attendance).filter(s => s === 'tarde').length
    const total = estudiantes.length

    const statusConfig = {
        presente: {
            icon: Check,
            color: 'text-green-600',
            bg: 'bg-green-500',
            bgLight: 'bg-green-50',
            border: 'border-green-500'
        },
        ausente: {
            icon: X,
            color: 'text-red-600',
            bg: 'bg-red-500',
            bgLight: 'bg-red-50',
            border: 'border-red-500'
        },
        tarde: {
            icon: Clock,
            color: 'text-amber-600',
            bg: 'bg-amber-500',
            bgLight: 'bg-amber-50',
            border: 'border-amber-500'
        }
    }

    return (
        <div className="pb-24">
            {/* Header */}
            <motion.div
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 pt-6 pb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-4 mb-4">
                    <Link href="/home" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl font-bold">Toma de Asistencia</h1>
                </div>

                {/* Class Selector */}
                <motion.button
                    onClick={() => setShowClassSelector(!showClassSelector)}
                    className="w-full flex items-center justify-between p-4 bg-white/10 rounded-xl"
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="flex items-center gap-3">
                        <Users className="w-5 h-5" />
                        <span className="font-medium">{clase}</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${showClassSelector ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                    {showClassSelector && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 space-y-2 overflow-hidden"
                        >
                            {clases.map(c => (
                                <button
                                    key={c}
                                    className={`w-full p-3 rounded-lg text-left text-sm ${c === clase ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'
                                        }`}
                                    onClick={() => setShowClassSelector(false)}
                                >
                                    {c}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Stats */}
            <motion.div
                className="flex items-center justify-center gap-6 py-4 bg-white border-b"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{presentes}</p>
                    <p className="text-xs text-gray-500">Presentes</p>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{ausentes}</p>
                    <p className="text-xs text-gray-500">Ausentes</p>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div className="text-center">
                    <p className="text-2xl font-bold text-amber-600">{tardes}</p>
                    <p className="text-xs text-gray-500">Tardes</p>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div className="text-center">
                    <p className="text-2xl font-bold text-gray-400">{total}</p>
                    <p className="text-xs text-gray-500">Total</p>
                </div>
            </motion.div>

            {/* Students List */}
            <div className="px-4 py-4">
                <div className="space-y-3">
                    {estudiantes.map((estudiante, idx) => {
                        const status = attendance[estudiante.id]

                        return (
                            <motion.div
                                key={estudiante.id}
                                className={`
                  card p-4 flex items-center gap-3
                  ${status ? `border-2 ${statusConfig[status].border}` : ''}
                `}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + idx * 0.05 }}
                            >
                                <img
                                    src={estudiante.foto}
                                    alt={estudiante.nombre}
                                    className="w-12 h-12 rounded-full"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">
                                        {estudiante.nombre} {estudiante.apellido}
                                    </h3>
                                </div>
                                <div className="flex gap-2">
                                    {(['presente', 'tarde', 'ausente'] as const).map(s => {
                                        const config = statusConfig[s]
                                        const Icon = config.icon
                                        const isSelected = status === s

                                        return (
                                            <motion.button
                                                key={s}
                                                onClick={() => handleAttendance(estudiante.id, s)}
                                                className={`
                          w-10 h-10 rounded-full flex items-center justify-center transition-all
                          ${isSelected
                                                        ? `${config.bg} text-white shadow-lg`
                                                        : `${config.bgLight} ${config.color}`
                                                    }
                        `}
                                                whileTap={{ scale: 0.9 }}
                                                animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                                            >
                                                <Icon className="w-5 h-5" />
                                            </motion.button>
                                        )
                                    })}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            {/* Save Button */}
            <motion.div
                className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur border-t"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div className="max-w-lg mx-auto">
                    <motion.button
                        onClick={saveAttendance}
                        disabled={saving || Object.values(attendance).every(s => s === null)}
                        className="btn btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        whileTap={{ scale: 0.98 }}
                    >
                        {saving ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Guardar Asistencia
                            </>
                        )}
                    </motion.button>
                </div>
            </motion.div>

            {/* Nav to Pautas */}
            <div className="px-4 mt-4">
                <Link href="/pautas">
                    <motion.div
                        className="card p-4 bg-gradient-to-r from-purple-50 to-pink-50 flex items-center justify-between"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📝</span>
                            <span className="font-medium text-gray-800">Registro de Pautas</span>
                        </div>
                        <ChevronDown className="w-5 h-5 text-gray-400 -rotate-90" />
                    </motion.div>
                </Link>
            </div>
        </div>
    )
}
