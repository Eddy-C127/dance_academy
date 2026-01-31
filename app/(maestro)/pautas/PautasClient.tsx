'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Send, ChevronDown, User } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import StarRating from '@/components/StarRating'

interface Estudiante {
    id: number
    nombre: string
    apellido: string
    foto: string
    especialidad: string
    nivel: string
}

interface PautasClientProps {
    estudiantes: Estudiante[]
    maestroId: number
}

const uniformeOptions = [
    { value: 'completo', label: '✅ Completo', color: 'bg-green-50 border-green-200 text-green-700' },
    { value: 'incompleto', label: '⚠️ Incompleto', color: 'bg-amber-50 border-amber-200 text-amber-700' },
    { value: 'no_presento', label: '❌ No presentó', color: 'bg-red-50 border-red-200 text-red-700' }
]

const progresoOptions = [
    { value: 'sobresaliente', label: '🌟 Sobresaliente', color: 'bg-purple-50 border-purple-200 text-purple-700' },
    { value: 'esperado', label: '👍 Esperado', color: 'bg-blue-50 border-blue-200 text-blue-700' },
    { value: 'necesita_refuerzo', label: '📚 Necesita refuerzo', color: 'bg-amber-50 border-amber-200 text-amber-700' }
]

const commentTemplates = [
    'Excelente participación hoy',
    'Mejoró notablemente en',
    'Necesita practicar más',
    'Actitud positiva',
    'Llegó con todo el material'
]

export default function PautasClient({ estudiantes, maestroId }: PautasClientProps) {
    const router = useRouter()
    const [selectedStudent, setSelectedStudent] = useState<Estudiante | null>(null)
    const [showStudentSelector, setShowStudentSelector] = useState(false)
    const [uniforme, setUniforme] = useState<string>('')
    const [disciplina, setDisciplina] = useState(0)
    const [participacion, setParticipacion] = useState(5)
    const [progreso, setProgreso] = useState<string>('')
    const [comentarios, setComentarios] = useState('')
    const [sending, setSending] = useState(false)

    const handleSubmit = async () => {
        if (!selectedStudent) {
            toast.error('Selecciona un estudiante')
            return
        }
        if (!uniforme || !disciplina || !progreso) {
            toast.error('Completa todos los campos requeridos')
            return
        }

        setSending(true)

        try {
            const response = await fetch('/api/pautas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    estudianteId: selectedStudent.id,
                    uniforme,
                    disciplina,
                    participacion,
                    progreso,
                    comentarios
                })
            })

            const data = await response.json()

            if (response.ok) {
                toast.success('¡Reporte enviado!', {
                    description: data.pointsAwarded > 0
                        ? `${selectedStudent.nombre} ganó +${data.pointsAwarded} puntos`
                        : undefined
                })

                // Reset form
                setSelectedStudent(null)
                setUniforme('')
                setDisciplina(0)
                setParticipacion(5)
                setProgreso('')
                setComentarios('')
            } else {
                toast.error('Error al enviar reporte')
            }
        } catch (error) {
            toast.error('Error de conexión')
        } finally {
            setSending(false)
        }
    }

    const addTemplate = (template: string) => {
        setComentarios(prev => prev ? `${prev}. ${template}` : template)
    }

    return (
        <div className="pb-8">
            {/* Header */}
            <motion.div
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 pt-6 pb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-4 mb-4">
                    <Link href="/asistencia" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl font-bold">Registro de Pautas</h1>
                </div>

                {/* Student Selector */}
                <motion.button
                    onClick={() => setShowStudentSelector(!showStudentSelector)}
                    className="w-full flex items-center justify-between p-4 bg-white/10 rounded-xl"
                    whileTap={{ scale: 0.98 }}
                >
                    {selectedStudent ? (
                        <div className="flex items-center gap-3">
                            <img
                                src={selectedStudent.foto}
                                alt={selectedStudent.nombre}
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="text-left">
                                <p className="font-medium">{selectedStudent.nombre} {selectedStudent.apellido}</p>
                                <p className="text-sm text-white/70">{selectedStudent.especialidad}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <User className="w-5 h-5" />
                            </div>
                            <span>Seleccionar estudiante</span>
                        </div>
                    )}
                    <ChevronDown className={`w-5 h-5 transition-transform ${showStudentSelector ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                    {showStudentSelector && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 max-h-60 overflow-y-auto rounded-xl bg-white/10"
                        >
                            {estudiantes.map(est => (
                                <button
                                    key={est.id}
                                    className="w-full p-3 flex items-center gap-3 hover:bg-white/10 transition-colors"
                                    onClick={() => {
                                        setSelectedStudent(est)
                                        setShowStudentSelector(false)
                                    }}
                                >
                                    <img
                                        src={est.foto}
                                        alt={est.nombre}
                                        className="w-9 h-9 rounded-full"
                                    />
                                    <div className="text-left">
                                        <p className="font-medium">{est.nombre} {est.apellido}</p>
                                        <p className="text-xs text-white/60">{est.especialidad} - {est.nivel}</p>
                                    </div>
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Form */}
            <div className="px-4 py-6 space-y-6">
                {/* Uniforme */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        👕 Uniforme
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {uniformeOptions.map(opt => (
                            <motion.button
                                key={opt.value}
                                onClick={() => setUniforme(opt.value)}
                                className={`
                  p-3 rounded-xl border-2 text-sm font-medium transition-all
                  ${uniforme === opt.value
                                        ? opt.color + ' !border-current'
                                        : 'bg-gray-50 border-gray-200 text-gray-600'}
                `}
                                whileTap={{ scale: 0.95 }}
                            >
                                {opt.label}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Disciplina */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        ⭐ Disciplina
                    </label>
                    <div className="card p-4 flex items-center justify-center">
                        <StarRating
                            rating={disciplina}
                            onChange={setDisciplina}
                            size="lg"
                        />
                    </div>
                </motion.div>

                {/* Participación */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        🙋 Participación: <span className="text-purple-600">{participacion}/10</span>
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={participacion}
                        onChange={(e) => setParticipacion(parseInt(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>1</span>
                        <span>5</span>
                        <span>10</span>
                    </div>
                </motion.div>

                {/* Progreso */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                >
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        📈 Progreso
                    </label>
                    <div className="space-y-2">
                        {progresoOptions.map(opt => (
                            <motion.button
                                key={opt.value}
                                onClick={() => setProgreso(opt.value)}
                                className={`
                  w-full p-4 rounded-xl border-2 text-left font-medium transition-all
                  ${progreso === opt.value
                                        ? opt.color + ' !border-current'
                                        : 'bg-gray-50 border-gray-200 text-gray-600'}
                `}
                                whileTap={{ scale: 0.98 }}
                            >
                                {opt.label}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Comentarios */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        💬 Comentarios
                    </label>

                    {/* Quick Templates */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {commentTemplates.map((template, idx) => (
                            <motion.button
                                key={idx}
                                onClick={() => addTemplate(template)}
                                className="chip text-xs"
                                whileTap={{ scale: 0.95 }}
                            >
                                {template}
                            </motion.button>
                        ))}
                    </div>

                    <textarea
                        value={comentarios}
                        onChange={(e) => setComentarios(e.target.value)}
                        placeholder="Escribe observaciones adicionales..."
                        rows={4}
                        className="input resize-none"
                    />
                </motion.div>

                {/* Submit Button */}
                <motion.button
                    onClick={handleSubmit}
                    disabled={sending || !selectedStudent}
                    className="btn btn-primary w-full py-4 text-lg disabled:opacity-50"
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                >
                    {sending ? (
                        <>
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Enviando...
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            Enviar Reporte
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    )
}
