'use client'

import { motion } from 'framer-motion'
import { Calendar, Star, Award, AlertCircle, ChevronRight } from 'lucide-react'
import { formatShortDate, getRelativeTime } from '@/lib/utils'

type FeedCardType = 'event' | 'achievement' | 'report' | 'alert'

interface FeedCardProps {
    type: FeedCardType
    title: string
    subtitle?: string
    description?: string
    date?: Date | string
    imageUrl?: string
    rating?: number
    points?: number
    icon?: string
    action?: {
        label: string
        onClick?: () => void
    }
    delay?: number
}

const cardStyles = {
    event: {
        icon: Calendar,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        borderColor: 'border-l-blue-500'
    },
    achievement: {
        icon: Award,
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        borderColor: 'border-l-amber-500'
    },
    report: {
        icon: Star,
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        borderColor: 'border-l-purple-500'
    },
    alert: {
        icon: AlertCircle,
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        borderColor: 'border-l-red-500'
    }
}

export default function FeedCard({
    type,
    title,
    subtitle,
    description,
    date,
    imageUrl,
    rating,
    points,
    icon,
    action,
    delay = 0
}: FeedCardProps) {
    const style = cardStyles[type]
    const Icon = style.icon

    return (
        <motion.div
            className={`card overflow-hidden border-l-4 ${style.borderColor}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
        >
            {/* Image Banner for Events */}
            {imageUrl && type === 'event' && (
                <div className="relative h-32 w-full overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                        <h3 className="text-white font-semibold text-lg">{title}</h3>
                        {date && (
                            <p className="text-white/80 text-sm">{formatShortDate(date)} • {getRelativeTime(date)}</p>
                        )}
                    </div>
                </div>
            )}

            <div className="p-4">
                {/* Header for non-event types */}
                {type !== 'event' && (
                    <div className="flex items-start gap-3 mb-3">
                        <div className={`p-2 rounded-xl ${style.iconBg}`}>
                            {icon ? (
                                <span className="text-2xl">{icon}</span>
                            ) : (
                                <Icon className={`w-5 h-5 ${style.iconColor}`} />
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-gray-900">{title}</h3>
                                {points && (
                                    <span className="badge badge-success text-xs">+{points} pts</span>
                                )}
                            </div>
                            {subtitle && (
                                <p className="text-sm text-gray-500">{subtitle}</p>
                            )}
                        </div>
                        {date && (
                            <span className="text-xs text-gray-400">{formatShortDate(date)}</span>
                        )}
                    </div>
                )}

                {/* Rating stars for reports */}
                {type === 'report' && rating && (
                    <div className="flex items-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-5 h-5 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'
                                    }`}
                            />
                        ))}
                        <span className="ml-2 text-sm font-medium text-gray-600">Calificación de hoy</span>
                    </div>
                )}

                {/* Achievement content */}
                {type === 'achievement' && icon && (
                    <div className="flex items-center justify-center py-4">
                        <motion.div
                            className="text-6xl"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                                delay: delay + 0.2
                            }}
                        >
                            {icon}
                        </motion.div>
                    </div>
                )}

                {/* Description */}
                {description && (
                    <p className={`text-sm text-gray-600 ${type === 'achievement' ? 'text-center' : ''}`}>
                        {type === 'report' && (
                            <span className="text-gray-400">&quot;</span>
                        )}
                        {description}
                        {type === 'report' && (
                            <span className="text-gray-400">&quot;</span>
                        )}
                    </p>
                )}

                {/* Event details */}
                {type === 'event' && !imageUrl && (
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`p-3 rounded-xl ${style.iconBg}`}>
                            <Icon className={`w-6 h-6 ${style.iconColor}`} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{title}</h3>
                            {date && (
                                <p className="text-sm text-gray-500">{formatShortDate(date)}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Action button */}
                {action && (
                    <motion.button
                        className={`
              w-full mt-3 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2
              ${type === 'alert'
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : type === 'event'
                                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
            `}
                        onClick={action.onClick}
                        whileTap={{ scale: 0.98 }}
                    >
                        {action.label}
                        <ChevronRight className="w-4 h-4" />
                    </motion.button>
                )}
            </div>
        </motion.div>
    )
}
