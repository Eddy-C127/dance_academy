'use client'

import { signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import {
    User,
    Phone,
    Mail,
    Bell,
    Shield,
    HelpCircle,
    LogOut,
    ChevronRight,
    Moon,
    Globe
} from 'lucide-react'
import { toast } from 'sonner'

interface CuentaClientProps {
    usuario: {
        id: number
        nombre: string
        email: string
        telefono: string | null
        avatar: string | null
        rol: string
        estudiantes: Array<{
            id: number
            nombre: string
            apellido: string
            foto: string
            especialidad: string
        }>
    }
}

export default function CuentaClient({ usuario }: CuentaClientProps) {
    const handleLogout = async () => {
        toast.promise(
            signOut({ callbackUrl: '/login' }),
            {
                loading: 'Cerrando sesión...',
                success: '¡Hasta pronto!',
                error: 'Error al cerrar sesión'
            }
        )
    }

    const menuItems = [
        {
            icon: Bell,
            label: 'Notificaciones',
            description: 'Configura tus alertas',
            action: () => toast.info('Próximamente')
        },
        {
            icon: Shield,
            label: 'Privacidad',
            description: 'Seguridad de tu cuenta',
            action: () => toast.info('Próximamente')
        },
        {
            icon: Moon,
            label: 'Modo Oscuro',
            description: 'Próximamente',
            action: () => toast.info('Próximamente')
        },
        {
            icon: Globe,
            label: 'Idioma',
            description: 'Español',
            action: () => toast.info('Próximamente')
        },
        {
            icon: HelpCircle,
            label: 'Ayuda',
            description: 'Soporte y preguntas',
            action: () => toast.info('Próximamente')
        }
    ]

    return (
        <div className="px-4 pt-6">
            {/* Header */}
            <motion.h1
                className="text-2xl font-bold text-gray-900 mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                Mi Cuenta
            </motion.h1>

            {/* Profile Card */}
            <motion.div
                className="card p-6 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                        <img
                            src={usuario.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
                            alt={usuario.nombre}
                            className="w-20 h-20 rounded-full ring-4 ring-purple-100"
                        />
                        <motion.button
                            className="absolute -bottom-1 -right-1 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center shadow-lg"
                            whileTap={{ scale: 0.9 }}
                        >
                            <User className="w-4 h-4 text-white" />
                        </motion.button>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{usuario.nombre}</h2>
                        <span className="badge badge-primary mt-1 capitalize">{usuario.rol}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span>{usuario.email}</span>
                    </div>
                    {usuario.telefono && (
                        <div className="flex items-center gap-3 text-gray-600">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <span>{usuario.telefono}</span>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Students */}
            {usuario.estudiantes.length > 0 && (
                <motion.div
                    className="card p-4 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        👧 Mis Hijas
                    </h3>
                    <div className="space-y-3">
                        {usuario.estudiantes.map((estudiante) => (
                            <div
                                key={estudiante.id}
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                            >
                                <img
                                    src={estudiante.foto}
                                    alt={estudiante.nombre}
                                    className="w-11 h-11 rounded-full"
                                />
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {estudiante.nombre} {estudiante.apellido}
                                    </p>
                                    <span className="text-sm text-gray-500">{estudiante.especialidad}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Settings Menu */}
            <motion.div
                className="card overflow-hidden mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                {menuItems.map((item, idx) => (
                    <motion.button
                        key={item.label}
                        onClick={item.action}
                        className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                            <item.icon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="font-medium text-gray-900">{item.label}</p>
                            <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </motion.button>
                ))}
            </motion.div>

            {/* Logout Button */}
            <motion.button
                onClick={handleLogout}
                className="w-full btn py-4 bg-red-50 hover:bg-red-100 text-red-600 font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileTap={{ scale: 0.98 }}
            >
                <LogOut className="w-5 h-5" />
                Cerrar Sesión
            </motion.button>

            {/* Footer */}
            <motion.p
                className="text-center text-xs text-gray-400 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                Dance Academy MVP v1.0
            </motion.p>
        </div>
    )
}
