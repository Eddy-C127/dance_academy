import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import HomeClient from './HomeClient'

export default async function HomePage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return null
    }

    // Fetch data for the feed
    const [eventos, pautas, logros, pagos] = await Promise.all([
        prisma.evento.findMany({
            where: {
                fecha: { gte: new Date() }
            },
            orderBy: { fecha: 'asc' },
            take: 3
        }),
        prisma.pauta.findMany({
            where: {
                estudiante: {
                    tutorId: parseInt(session.user.id)
                }
            },
            include: {
                estudiante: true,
                maestro: true
            },
            orderBy: { fecha: 'desc' },
            take: 3
        }),
        prisma.logro.findMany({
            where: {
                estudiante: {
                    tutorId: parseInt(session.user.id)
                },
                fecha: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
                }
            },
            include: {
                estudiante: true
            },
            orderBy: { fecha: 'desc' },
            take: 3
        }),
        prisma.pago.findMany({
            where: {
                tutorId: parseInt(session.user.id),
                estado: { not: 'pagado' }
            },
            orderBy: { fechaVenc: 'asc' },
            take: 2
        })
    ])

    return (
        <HomeClient
            user={{
                ...session.user,
                role: session.user.role
            }}
            eventos={eventos}
            pautas={pautas}
            logros={logros}
            pagos={pagos}
        />
    )
}
