import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import PagosClient from './PagosClient'

export default async function PagosPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return null
    }

    const pagos = await prisma.pago.findMany({
        where: {
            tutorId: parseInt(session.user.id)
        },
        orderBy: { fechaVenc: 'asc' }
    })

    // Calculate totals
    const now = new Date()
    const pagosConEstado = pagos.map(pago => {
        if (pago.estado === 'pagado') return pago
        const vencimiento = new Date(pago.fechaVenc)
        if (vencimiento < now) {
            return { ...pago, estado: 'vencido' }
        }
        return pago
    })

    const totalPendiente = pagosConEstado
        .filter(p => p.estado !== 'pagado')
        .reduce((sum, p) => sum + p.monto, 0)

    const totalVencido = pagosConEstado
        .filter(p => p.estado === 'vencido')
        .reduce((sum, p) => sum + p.monto, 0)

    return (
        <PagosClient
            pagos={pagosConEstado}
            totalPendiente={totalPendiente}
            totalVencido={totalVencido}
        />
    )
}
