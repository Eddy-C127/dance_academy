import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import AsistenciaClient from './AsistenciaClient'

export default async function AsistenciaPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return null
    }

    // Get today's date without time
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Get all students for the class
    const estudiantes = await prisma.estudiante.findMany({
        where: {
            especialidad: 'Ballet',
            nivel: 'Intermedio'
        },
        include: {
            asistencias: {
                where: {
                    fecha: {
                        gte: today,
                        lt: tomorrow
                    },
                    clase: 'Ballet Intermedio - Grupo A'
                }
            }
        }
    })

    const estudiantesConAsistencia = estudiantes.map(est => ({
        id: est.id,
        nombre: est.nombre,
        apellido: est.apellido,
        foto: est.foto,
        asistencia: est.asistencias[0]?.estado || null
    }))

    return (
        <AsistenciaClient
            estudiantes={estudiantesConAsistencia}
            clase="Ballet Intermedio - Grupo A"
            maestroId={parseInt(session.user.id)}
        />
    )
}
