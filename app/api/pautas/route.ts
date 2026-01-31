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

        const pautas = await prisma.pauta.findMany({
            include: {
                estudiante: true,
                maestro: true
            },
            orderBy: { fecha: 'desc' },
            take: 20
        })

        return NextResponse.json(pautas)
    } catch (error) {
        console.error('Error fetching pautas:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'maestro') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const { estudianteId, uniforme, disciplina, participacion, progreso, comentarios } = body

        const pauta = await prisma.pauta.create({
            data: {
                estudianteId,
                uniforme,
                disciplina,
                participacion,
                progreso,
                comentarios,
                maestroId: parseInt(session.user.id)
            },
            include: {
                estudiante: true
            }
        })

        // Award points based on evaluation
        let pointsToAdd = 0
        if (disciplina === 5) pointsToAdd += 20
        if (participacion >= 8) pointsToAdd += 15
        if (progreso === 'sobresaliente') pointsToAdd += 30
        if (uniforme === 'completo') pointsToAdd += 5

        if (pointsToAdd > 0) {
            await prisma.estudiante.update({
                where: { id: estudianteId },
                data: {
                    puntos: {
                        increment: pointsToAdd
                    }
                }
            })
        }

        return NextResponse.json({ ...pauta, pointsAwarded: pointsToAdd })
    } catch (error) {
        console.error('Error saving pauta:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
