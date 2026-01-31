'use client'

import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    color?: string
}

const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
}

export default function LoadingSpinner({ size = 'md', color = '#6C5CE7' }: LoadingSpinnerProps) {
    return (
        <div className="flex items-center justify-center">
            <motion.div
                className={`${sizes[size]} border-2 border-gray-200 rounded-full`}
                style={{ borderTopColor: color }}
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
        </div>
    )
}

export function PageLoader() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <motion.div
                className="text-6xl"
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                💃
            </motion.div>
            <LoadingSpinner size="lg" />
            <p className="text-gray-500 font-medium">Cargando...</p>
        </div>
    )
}
