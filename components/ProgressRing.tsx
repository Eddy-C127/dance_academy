'use client'

import { motion } from 'framer-motion'

interface ProgressRingProps {
    progress: number
    size?: number
    strokeWidth?: number
    color?: string
    backgroundColor?: string
    children?: React.ReactNode
}

export default function ProgressRing({
    progress,
    size = 120,
    strokeWidth = 8,
    color = '#6C5CE7',
    backgroundColor = '#E8E8E8',
    children
}: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDashoffset = circumference - (progress / 100) * circumference

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg
                width={size}
                height={size}
                className="progress-ring"
            >
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={backgroundColor}
                    strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="progress-ring__circle"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                {children}
            </div>
        </div>
    )
}
