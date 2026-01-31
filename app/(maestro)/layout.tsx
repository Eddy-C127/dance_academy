import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function MaestroLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    // Optional: Check if user is a teacher
    // if (session.user.role !== 'maestro') {
    //   redirect('/home')
    // }

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-lg mx-auto">
                {children}
            </main>
        </div>
    )
}
