import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const pagos = await prisma.pago.findMany({
            where: {
                tutorId: parseInt(session.user.id)
            },
            orderBy: { fechaVenc: 'asc' }
        })

        // Update status based on current date
        const now = new Date()
        const pagosConEstado = pagos.map(pago => {
            if (pago.estado === 'pagado') return pago
            const vencimiento = new Date(pago.fechaVenc)
            if (vencimiento < now) {
                return { ...pago, estado: 'vencido' }
            }
            return pago
        })

        return NextResponse.json(pagosConEstado)
    } catch (error) {
        console.error('Error fetching pagos:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const { pagoId } = body

        // Simulate payment
        const pago = await prisma.pago.update({
            where: { id: pagoId },
            data: { estado: 'pagado' }
        })

        return NextResponse.json({ success: true, pago })
    } catch (error) {
        console.error('Error processing pago:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
