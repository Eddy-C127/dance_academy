import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return null
    }

    // Obtener fecha de inicio de la semana (lunes)
    const today = new Date()
    const dayOfWeek = today.getDay()
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - diffToMonday)
    startOfWeek.setHours(0, 0, 0, 0)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    // Obtener todas las métricas en paralelo
    const [
        maestros,
        eventos,
        pagosVencidos,
        asistenciasSemana,
        totalEstudiantes,
        clasesSemana
    ] = await Promise.all([
        // Maestros con sus asistencias tomadas esta semana
        prisma.usuario.findMany({
            where: { rol: 'maestro' },
            include: {
                asistenciasTomadas: {
                    where: {
                        fecha: {
                            gte: startOfWeek,
                            lte: endOfWeek
                        }
                    }
                },
                pautasCreadas: {
                    where: {
                        fecha: {
                            gte: startOfWeek,
                            lte: endOfWeek
                        }
                    }
                }
            }
        }),
        // Próximos eventos
        prisma.evento.findMany({
            where: {
                fecha: { gte: new Date() }
            },
            orderBy: { fecha: 'asc' },
            take: 5
        }),
        // Pagos vencidos con información del tutor
        prisma.pago.findMany({
            where: {
                estado: 'vencido'
            },
            include: {
                tutor: true
            },
            orderBy: { fechaVenc: 'asc' }
        }),
        // Asistencias de la semana
        prisma.asistencia.findMany({
            where: {
                fecha: {
                    gte: startOfWeek,
                    lte: endOfWeek
                }
            },
            include: {
                estudiante: true
            }
        }),
        // Total de estudiantes
        prisma.estudiante.count(),
        // Clases únicas de la semana (agrupadas por clase y fecha)
        prisma.asistencia.groupBy({
            by: ['clase', 'fecha'],
            where: {
                fecha: {
                    gte: startOfWeek,
                    lte: endOfWeek
                }
            }
        })
    ])

    // Procesar datos de maestros
    const maestrosData = maestros.map(m => {
        const clasesImpartidas = new Set(
            m.asistenciasTomadas.map(a => `${a.clase}-${a.fecha.toDateString()}`)
        ).size
        const horasTrabajadas = clasesImpartidas * 1.5 // Cada clase = 1.5 horas
        const pagoPorHora = 150 // $150 MXN por hora
        const pagoSemanal = horasTrabajadas * pagoPorHora

        return {
            id: m.id,
            nombre: m.nombre,
            avatar: m.avatar,
            clasesImpartidas,
            horasTrabajadas,
            pagoSemanal,
            pautasCreadas: m.pautasCreadas.length
        }
    })

    // Procesar resumen de asistencia
    const asistenciaResumen = {
        presentes: asistenciasSemana.filter(a => a.estado === 'presente').length,
        tardes: asistenciasSemana.filter(a => a.estado === 'tarde').length,
        ausentes: asistenciasSemana.filter(a => a.estado === 'ausente').length,
        justificados: asistenciasSemana.filter(a => a.estado === 'justificado').length,
        total: asistenciasSemana.length
    }

    // Procesar pagos vencidos
    const pagosVencidosData = pagosVencidos.map(p => ({
        id: p.id,
        concepto: p.concepto,
        monto: p.monto,
        fechaVenc: p.fechaVenc,
        tutorNombre: p.tutor.nombre,
        tutorEmail: p.tutor.email,
        tutorTelefono: p.tutor.telefono,
        estudianteNombre: p.estudianteNombre
    }))

    return (
        <AdminDashboardClient
            user={session.user}
            maestros={maestrosData}
            eventos={eventos}
            pagosVencidos={pagosVencidosData}
            asistenciaResumen={asistenciaResumen}
            totalEstudiantes={totalEstudiantes}
            totalClasesSemana={clasesSemana.length}
            fechaSemana={{
                inicio: startOfWeek.toISOString(),
                fin: endOfWeek.toISOString()
            }}
        />
    )
}
