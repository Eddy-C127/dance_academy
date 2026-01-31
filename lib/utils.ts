import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
    const d = new Date(date)
    return d.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

export function formatShortDate(date: Date | string): string {
    const d = new Date(date)
    return d.toLocaleDateString('es-MX', {
        month: 'short',
        day: 'numeric'
    })
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(amount)
}

export function getDaysUntil(date: Date | string): number {
    const target = new Date(date)
    const now = new Date()
    const diffTime = target.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function getRelativeTime(date: Date | string): string {
    const days = getDaysUntil(date)
    if (days < 0) return `Hace ${Math.abs(days)} días`
    if (days === 0) return 'Hoy'
    if (days === 1) return 'Mañana'
    if (days < 7) return `En ${days} días`
    if (days < 30) return `En ${Math.ceil(days / 7)} semanas`
    return `En ${Math.ceil(days / 30)} meses`
}
