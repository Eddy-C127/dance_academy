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

        const estudiantes = await prisma.estudiante.findMany({
            where: {
                tutorId: parseInt(session.user.id)
            },
            include: {
                asistencias: {
                    where: {
                        fecha: {
                            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                        }
                    }
                },
                logros: true,
                pautas: {
                    orderBy: { fecha: 'desc' },
                    take: 5
                }
            }
        })

        const estudiantesConStats = estudiantes.map(est => {
            const totalAsistencias = est.asistencias.length
            const presentes = est.asistencias.filter(a => a.estado === 'presente').length
            const porcentajeAsistencia = totalAsistencias > 0
                ? Math.round((presentes / totalAsistencias) * 100)
                : 0

            return {
                id: est.id,
                nombre: est.nombre,
                apellido: est.apellido,
                foto: est.foto,
                especialidad: est.especialidad,
                nivel: est.nivel,
                puntos: est.puntos,
                asistencia: porcentajeAsistencia,
                logros: est.logros,
                pautas: est.pautas
            }
        })

        return NextResponse.json(estudiantesConStats)
    } catch (error) {
        console.error('Error fetching estudiantes:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
