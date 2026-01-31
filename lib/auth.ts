import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from './prisma'

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Por favor ingresa email y contraseña')
                }

                const user = await prisma.usuario.findUnique({
                    where: { email: credentials.email }
                })

                if (!user) {
                    throw new Error('Usuario no encontrado')
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

                if (!isPasswordValid) {
                    throw new Error('Contraseña incorrecta')
                }

                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.nombre,
                    role: user.rol,
                    avatar: user.avatar
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id = user.id
                token.avatar = user.avatar
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as string
                session.user.id = token.id as string
                session.user.avatar = token.avatar as string
            }
            return session
        }
    },
    pages: {
        signIn: '/login'
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET || 'super-secret-key-for-development'
}
