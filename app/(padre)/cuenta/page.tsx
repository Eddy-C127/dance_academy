import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import CuentaClient from './CuentaClient'

export default async function CuentaPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return null
    }

    const usuario = await prisma.usuario.findUnique({
        where: { id: parseInt(session.user.id) },
        include: {
            estudiantes: true
        }
    })

    if (!usuario) {
        return null
    }

    return (
        <CuentaClient
            usuario={{
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                telefono: usuario.telefono,
                avatar: usuario.avatar,
                rol: usuario.rol,
                estudiantes: usuario.estudiantes
            }}
        />
    )
}
