'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, User, BarChart3, CreditCard, Bell } from 'lucide-react'
import { motion } from 'framer-motion'

interface NavItem {
    icon: React.ComponentType<{ className?: string; fill?: string; stroke?: string }>
    label: string
    href: string
    isCenter?: boolean
    badge?: number
}

export default function BottomNav() {
    const pathname = usePathname()

    const navItems: NavItem[] = [
        { icon: User, label: 'Cuenta', href: '/cuenta' },
        { icon: BarChart3, label: 'Stats', href: '/stats' },
        { icon: Home, label: 'Home', href: '/home', isCenter: true },
        { icon: CreditCard, label: 'Pagos', href: '/pagos' },
        { icon: Bell, label: 'Notif', href: '/notificaciones', badge: 3 },
    ]

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 z-50 safe-area-pb">
            <div className="max-w-lg mx-auto px-2">
                <div className="flex items-end justify-around py-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex flex-col items-center touch-feedback"
                            >
                                <motion.div
                                    className={`
                    relative p-2 rounded-2xl transition-colors
                    ${item.isCenter
                                            ? 'gradient-primary shadow-lg shadow-purple-300/50 -mt-4 p-3'
                                            : isActive
                                                ? 'bg-purple-50'
                                                : ''
                                        }
                  `}
                                    whileTap={{ scale: 0.95 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Icon
                                        className={`
                      w-6 h-6 transition-all
                      ${item.isCenter
                                                ? 'text-white w-7 h-7'
                                                : isActive
                                                    ? 'text-purple-600'
                                                    : 'text-gray-400'
                                            }
                    `}
                                        fill={isActive && !item.isCenter ? 'currentColor' : 'none'}
                                        stroke="currentColor"
                                    />
                                    {item.badge && item.badge > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                            {item.badge}
                                        </span>
                                    )}
                                </motion.div>
                                <span className={`
                  text-[10px] mt-1 font-medium
                  ${item.isCenter
                                        ? 'text-purple-600'
                                        : isActive
                                            ? 'text-purple-600'
                                            : 'text-gray-400'
                                    }
                `}>
                                    {item.label}
                                </span>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}
