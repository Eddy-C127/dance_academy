'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatCurrency, formatShortDate, getDaysUntil } from '@/lib/utils'
import { CreditCard, AlertTriangle, Clock, CheckCircle2, X } from 'lucide-react'
import { toast } from 'sonner'

interface PagosClientProps {
    pagos: Array<{
        id: number
        concepto: string
        monto: number
        fechaVenc: Date
        estado: string
        estudianteNombre: string | null
    }>
    totalPendiente: number
    totalVencido: number
}

export default function PagosClient({ pagos, totalPendiente, totalVencido }: PagosClientProps) {
    const [showModal, setShowModal] = useState(false)
    const [selectedPago, setSelectedPago] = useState<typeof pagos[0] | null>(null)
    const [processing, setProcessing] = useState(false)

    const handlePay = (pago: typeof pagos[0]) => {
        setSelectedPago(pago)
        setShowModal(true)
    }

    const confirmPayment = async () => {
        setProcessing(true)

        // Simulate payment
        await new Promise(resolve => setTimeout(resolve, 2000))

        toast.success('¡Pago procesado exitosamente!', {
            description: `Se ha registrado el pago de ${formatCurrency(selectedPago?.monto || 0)}`
        })

        setProcessing(false)
        setShowModal(false)
    }

    const getStatusConfig = (estado: string) => {
        switch (estado) {
            case 'vencido':
                return {
                    icon: AlertTriangle,
                    color: 'text-red-600',
                    bg: 'bg-red-50',
                    border: 'border-red-200',
                    label: 'Vencido'
                }
            case 'pendiente':
                return {
                    icon: Clock,
                    color: 'text-amber-600',
                    bg: 'bg-amber-50',
                    border: 'border-amber-200',
                    label: 'Pendiente'
                }
            case 'pagado':
                return {
                    icon: CheckCircle2,
                    color: 'text-green-600',
                    bg: 'bg-green-50',
                    border: 'border-green-200',
                    label: 'Pagado'
                }
            default:
                return {
                    icon: Clock,
                    color: 'text-gray-600',
                    bg: 'bg-gray-50',
                    border: 'border-gray-200',
                    label: estado
                }
        }
    }

    return (
        <div className="px-4 pt-6">
            {/* Header */}
            <motion.h1
                className="text-2xl font-bold text-gray-900 mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                Pagos
            </motion.h1>

            {/* Summary Cards */}
            <motion.div
                className="grid grid-cols-2 gap-3 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="card p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-amber-600" />
                        <span className="text-sm font-medium text-amber-800">Pendiente</span>
                    </div>
                    <p className="text-2xl font-bold text-amber-900">{formatCurrency(totalPendiente)}</p>
                </div>

                {totalVencido > 0 && (
                    <div className="card p-4 bg-gradient-to-br from-red-50 to-pink-50 border border-red-100">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                            <span className="text-sm font-medium text-red-800">Vencido</span>
                        </div>
                        <p className="text-2xl font-bold text-red-900">{formatCurrency(totalVencido)}</p>
                    </div>
                )}
            </motion.div>

            {/* Payments List */}
            <div className="space-y-3">
                {pagos.map((pago, idx) => {
                    const status = getStatusConfig(pago.estado)
                    const StatusIcon = status.icon
                    const daysUntil = getDaysUntil(pago.fechaVenc)

                    return (
                        <motion.div
                            key={pago.id}
                            className={`card p-4 border ${status.border}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + idx * 0.1 }}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{pago.concepto}</h3>
                                    {pago.estudianteNombre && (
                                        <p className="text-sm text-gray-500">{pago.estudianteNombre}</p>
                                    )}
                                </div>
                                <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${status.bg}`}>
                                    <StatusIcon className={`w-4 h-4 ${status.color}`} />
                                    <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
                                </div>
                            </div>

                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(pago.monto)}</p>
                                    <p className={`text-sm ${daysUntil < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                        Vence: {formatShortDate(pago.fechaVenc)}
                                        {daysUntil < 0
                                            ? ` (hace ${Math.abs(daysUntil)} días)`
                                            : daysUntil === 0
                                                ? ' (Hoy)'
                                                : daysUntil <= 7
                                                    ? ` (en ${daysUntil} días)`
                                                    : ''
                                        }
                                    </p>
                                </div>

                                {pago.estado !== 'pagado' && (
                                    <motion.button
                                        onClick={() => handlePay(pago)}
                                        className="btn btn-primary py-2 px-4"
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <CreditCard className="w-4 h-4" />
                                        Pagar
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Payment Modal */}
            <AnimatePresence>
                {showModal && selectedPago && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center sm:items-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => !processing && setShowModal(false)}
                    >
                        <motion.div
                            className="bg-white rounded-2xl w-full max-w-sm p-6"
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Confirmar Pago</h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    disabled={processing}
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-sm text-gray-500 mb-1">Concepto</p>
                                    <p className="font-semibold text-gray-900">{selectedPago.concepto}</p>
                                </div>

                                <div className="bg-purple-50 rounded-xl p-4">
                                    <p className="text-sm text-purple-600 mb-1">Monto a pagar</p>
                                    <p className="text-3xl font-bold text-purple-700">{formatCurrency(selectedPago.monto)}</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    disabled={processing}
                                    className="btn btn-ghost flex-1"
                                >
                                    Cancelar
                                </button>
                                <motion.button
                                    onClick={confirmPayment}
                                    disabled={processing}
                                    className="btn btn-primary flex-1"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {processing ? (
                                        <>
                                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Procesando...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-5 h-5" />
                                            Confirmar
                                        </>
                                    )}
                                </motion.button>
                            </div>

                            <p className="text-xs text-gray-400 text-center mt-4">
                                Demo: El pago es simulado
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
