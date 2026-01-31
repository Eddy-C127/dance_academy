import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const clase = searchParams.get('clase') || 'Ballet Intermedio - Grupo A'
        const fecha = searchParams.get('fecha') || new Date().toISOString().split('T')[0]

        // Get all students for the class with their attendance for today
        const estudiantes = await prisma.estudiante.findMany({
            where: {
                especialidad: 'Ballet',
                nivel: 'Intermedio'
            },
            include: {
                asistencias: {
                    where: {
                        fecha: {
                            gte: new Date(fecha),
                            lt: new Date(new Date(fecha).getTime() + 24 * 60 * 60 * 1000)
                        },
                        clase: clase
                    }
                }
            }
        })

        return NextResponse.json(estudiantes.map(est => ({
            id: est.id,
            nombre: est.nombre,
            apellido: est.apellido,
            foto: est.foto,
            especialidad: est.especialidad,
            nivel: est.nivel,
            asistencia: est.asistencias[0] || null
        })))
    } catch (error) {
        console.error('Error fetching asistencias:', error)
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
        const { estudianteId, estado, clase } = body

        // Check if attendance already exists for today
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const existingAttendance = await prisma.asistencia.findFirst({
            where: {
                estudianteId,
                clase,
                fecha: {
                    gte: today,
                    lt: tomorrow
                }
            }
        })

        if (existingAttendance) {
            // Update existing
            const updated = await prisma.asistencia.update({
                where: { id: existingAttendance.id },
                data: { estado }
            })
            return NextResponse.json(updated)
        } else {
            // Create new
            const created = await prisma.asistencia.create({
                data: {
                    estudianteId,
                    estado,
                    clase,
                    maestroId: parseInt(session.user.id)
                }
            })
            return NextResponse.json(created)
        }
    } catch (error) {
        console.error('Error saving asistencia:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
