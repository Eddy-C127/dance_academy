import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import PautasClient from './PautasClient'

export default async function PautasPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return null
    }

    const estudiantes = await prisma.estudiante.findMany({
        select: {
            id: true,
            nombre: true,
            apellido: true,
            foto: true,
            especialidad: true,
            nivel: true
        },
        orderBy: { nombre: 'asc' }
    })

    return (
        <PautasClient
            estudiantes={estudiantes}
            maestroId={parseInt(session.user.id)}
        />
    )
}
