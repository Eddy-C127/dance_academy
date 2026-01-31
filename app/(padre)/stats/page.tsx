import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import StatsClient from './StatsClient'

export default async function StatsPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return null
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
            logros: {
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
            logros: est.logros
        }
    })

    // Get top 5 for leaderboard
    const topEstudiantes = await prisma.estudiante.findMany({
        orderBy: { puntos: 'desc' },
        take: 5,
        select: {
            id: true,
            nombre: true,
            apellido: true,
            foto: true,
            puntos: true
        }
    })

    return (
        <StatsClient
            estudiantes={estudiantesConStats}
            leaderboard={topEstudiantes}
        />
    )
}
