'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !password) {
            toast.error('Por favor ingresa email y contraseña')
            return
        }

        setLoading(true)

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false
            })

            if (result?.error) {
                toast.error(result.error)
            } else if (result?.ok) {
                toast.success('¡Bienvenido!')
                router.push('/home')
                router.refresh()
            }
        } catch (error) {
            toast.error('Error al iniciar sesión')
        } finally {
            setLoading(false)
        }
    }

    const loginAsDemo = async (demoEmail: string) => {
        setEmail(demoEmail)
        setPassword('demo123')

        setLoading(true)
        try {
            const result = await signIn('credentials', {
                email: demoEmail,
                password: 'demo123',
                redirect: false
            })

            if (result?.ok) {
                toast.success('¡Bienvenido!')
                if (demoEmail === 'maestra@demo.com') {
                    router.push('/asistencia')
                } else {
                    router.push('/home')
                }
                router.refresh()
            }
        } catch (error) {
            toast.error('Error al iniciar sesión')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 via-white to-pink-50">
            <motion.div
                className="w-full max-w-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Logo */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                >
                    <div className="text-7xl mb-4">💃</div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
                        Dance Academy
                    </h1>
                    <p className="text-gray-500 mt-2">Sistema de Gestión</p>
                </motion.div>

                {/* Login Form */}
                <motion.form
                    onSubmit={handleLogin}
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                            autoComplete="email"
                        />
                    </div>

                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input pr-12"
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    <motion.button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full py-4 text-lg"
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Ingresando...
                            </>
                        ) : (
                            'Iniciar Sesión'
                        )}
                    </motion.button>
                </motion.form>

                {/* Demo Users */}
                <motion.div
                    className="mt-8 p-4 bg-white rounded-2xl shadow-sm border border-gray-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <p className="text-center text-sm text-gray-500 mb-4 font-medium">
                        🎯 Acceso Rápido Demo
                    </p>
                    <div className="space-y-2">
                        <motion.button
                            onClick={() => loginAsDemo('padre@demo.com')}
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl text-left flex items-center gap-3 transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="text-2xl">👨‍👧‍👧</span>
                            <div>
                                <p className="font-semibold text-gray-800">Padre</p>
                                <p className="text-xs text-gray-500">padre@demo.com</p>
                            </div>
                        </motion.button>

                        <motion.button
                            onClick={() => loginAsDemo('maestra@demo.com')}
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-xl text-left flex items-center gap-3 transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="text-2xl">👩‍🏫</span>
                            <div>
                                <p className="font-semibold text-gray-800">Maestra</p>
                                <p className="text-xs text-gray-500">maestra@demo.com</p>
                            </div>
                        </motion.button>

                        <motion.button
                            onClick={() => loginAsDemo('admin@demo.com')}
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-green-50 to-blue-50 hover:from-green-100 hover:to-blue-100 rounded-xl text-left flex items-center gap-3 transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="text-2xl">👤</span>
                            <div>
                                <p className="font-semibold text-gray-800">Admin</p>
                                <p className="text-xs text-gray-500">admin@demo.com</p>
                            </div>
                        </motion.button>
                    </div>
                </motion.div>

                <p className="text-center text-xs text-gray-400 mt-6">
                    Versión MVP Demo • Dance Academy 2026
                </p>
            </motion.div>
        </div>
    )
}
