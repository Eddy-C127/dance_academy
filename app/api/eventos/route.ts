import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const eventos = await prisma.evento.findMany({
            where: {
                fecha: {
                    gte: new Date()
                }
            },
            orderBy: { fecha: 'asc' }
        })

        return NextResponse.json(eventos)
    } catch (error) {
        console.error('Error fetching eventos:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
