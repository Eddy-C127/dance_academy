import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import BottomNav from '@/components/BottomNav'

export default async function PadreLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-lg mx-auto pb-24">
                {children}
            </main>
            <BottomNav />
        </div>
    )
}
