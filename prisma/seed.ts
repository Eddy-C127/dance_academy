import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🧹 Limpiando base de datos...')

    // Limpiar base de datos en orden correcto (respetando foreign keys)
    await prisma.logro.deleteMany()
    await prisma.pauta.deleteMany()
    await prisma.asistencia.deleteMany()
    await prisma.pago.deleteMany()
    await prisma.estudiante.deleteMany()
    await prisma.evento.deleteMany()
    await prisma.usuario.deleteMany()

    console.log('👤 Creando usuarios...')

    // Crear usuarios con contraseñas hasheadas
    const hashedPassword = await bcrypt.hash('demo123', 10)

    const padre = await prisma.usuario.create({
        data: {
            email: 'padre@demo.com',
            password: hashedPassword,
            nombre: 'Roberto García',
            rol: 'padre',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto',
            telefono: '8715640952'
        }
    })

    const maestra = await prisma.usuario.create({
        data: {
            email: 'maestra@demo.com',
            password: hashedPassword,
            nombre: 'Claudia Martínez',
            rol: 'maestro',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Claudia',
            telefono: '8712345678'
        }
    })

    const admin = await prisma.usuario.create({
        data: {
            email: 'admin@demo.com',
            password: hashedPassword,
            nombre: 'Admin Sistema',
            rol: 'admin',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
            telefono: '8710000000'
        }
    })

    // Segundo padre para demostrar seguridad de datos
    const padre2 = await prisma.usuario.create({
        data: {
            email: 'fernanda@demo.com',
            password: hashedPassword,
            nombre: 'Fernanda Rodríguez',
            rol: 'padre',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fernanda',
            telefono: '8719876543'
        }
    })

    console.log('💃 Creando estudiantes...')

    // Crear estudiantes (hijas del padre)
    const ana = await prisma.estudiante.create({
        data: {
            nombre: 'Ana',
            apellido: 'García',
            fechaNacimiento: new Date('2015-03-15'),
            foto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana&backgroundColor=b6e3f4',
            especialidad: 'Ballet',
            nivel: 'Intermedio',
            puntos: 1240,
            tutorId: padre.id
        }
    })

    const lupita = await prisma.estudiante.create({
        data: {
            nombre: 'Lupita',
            apellido: 'García',
            fechaNacimiento: new Date('2013-07-22'),
            foto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lupita&backgroundColor=ffdfbf',
            especialidad: 'Contemporáneo',
            nivel: 'Avanzado',
            puntos: 890,
            tutorId: padre.id
        }
    })

    // Crear más estudiantes para la clase (asignadas a otro padre - para demostrar seguridad de datos)
    const sofia = await prisma.estudiante.create({
        data: {
            nombre: 'Sofía',
            apellido: 'Rodríguez',
            fechaNacimiento: new Date('2014-05-10'),
            foto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia&backgroundColor=ffd5dc',
            especialidad: 'Ballet',
            nivel: 'Intermedio',
            puntos: 950,
            tutorId: padre2.id
        }
    })

    const maria = await prisma.estudiante.create({
        data: {
            nombre: 'María',
            apellido: 'López',
            fechaNacimiento: new Date('2014-11-28'),
            foto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria&backgroundColor=c0aede',
            especialidad: 'Ballet',
            nivel: 'Intermedio',
            puntos: 780,
            tutorId: padre2.id
        }
    })

    const camila = await prisma.estudiante.create({
        data: {
            nombre: 'Camila',
            apellido: 'Hernández',
            fechaNacimiento: new Date('2015-01-15'),
            foto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Camila&backgroundColor=d1f4d1',
            especialidad: 'Ballet',
            nivel: 'Intermedio',
            puntos: 720,
            tutorId: padre2.id
        }
    })

    const valentina = await prisma.estudiante.create({
        data: {
            nombre: 'Valentina',
            apellido: 'Sánchez',
            fechaNacimiento: new Date('2014-08-03'),
            foto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Valentina&backgroundColor=ffe6cc',
            especialidad: 'Ballet',
            nivel: 'Intermedio',
            puntos: 850,
            tutorId: padre2.id
        }
    })

    const isabella = await prisma.estudiante.create({
        data: {
            nombre: 'Isabella',
            apellido: 'Martínez',
            fechaNacimiento: new Date('2015-04-20'),
            foto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella&backgroundColor=cce6ff',
            especialidad: 'Ballet',
            nivel: 'Intermedio',
            puntos: 680,
            tutorId: padre2.id
        }
    })

    const renata = await prisma.estudiante.create({
        data: {
            nombre: 'Renata',
            apellido: 'González',
            fechaNacimiento: new Date('2014-12-10'),
            foto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Renata&backgroundColor=e6ccff',
            especialidad: 'Ballet',
            nivel: 'Intermedio',
            puntos: 920,
            tutorId: padre2.id
        }
    })

    const allEstudiantes = [ana, lupita, sofia, maria, camila, valentina, isabella, renata]

    console.log('📅 Creando asistencias...')

    // Crear asistencias (últimos 10 días para todos los estudiantes)
    for (const estudiante of allEstudiantes) {
        for (let i = 0; i < 10; i++) {
            const estados = ['presente', 'presente', 'presente', 'presente', 'presente', 'presente', 'presente', 'tarde', 'ausente', 'presente']
            await prisma.asistencia.create({
                data: {
                    fecha: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
                    estado: estados[i],
                    clase: 'Ballet Intermedio - Grupo A',
                    estudianteId: estudiante.id,
                    maestroId: maestra.id
                }
            })
        }
    }

    console.log('📝 Creando pautas...')

    // Crear pautas recientes
    await prisma.pauta.create({
        data: {
            uniforme: 'completo',
            disciplina: 5,
            participacion: 9,
            progreso: 'sobresaliente',
            comentarios: 'Ana demostró excelente técnica en clase de hoy. Su pirueta ha mejorado notablemente. ¡Felicidades!',
            estudianteId: ana.id,
            maestroId: maestra.id,
            fecha: new Date()
        }
    })

    await prisma.pauta.create({
        data: {
            uniforme: 'completo',
            disciplina: 4,
            participacion: 8,
            progreso: 'esperado',
            comentarios: 'Lupita continúa progresando en sus movimientos de piso. Mantiene buena actitud.',
            estudianteId: lupita.id,
            maestroId: maestra.id,
            fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
    })

    console.log('🏆 Creando logros...')

    // Crear logros
    await prisma.logro.create({
        data: {
            tipo: 'estrella_ascenso',
            nombre: 'Estrella en Ascenso',
            descripcion: '1 mes de asistencia perfecta',
            icono: '🏆',
            puntos: 100,
            estudianteId: ana.id,
            fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        }
    })

    await prisma.logro.create({
        data: {
            tipo: 'rey_disciplina',
            nombre: 'Reina de la Disciplina',
            descripcion: '10 reportes excelentes consecutivos',
            icono: '👑',
            puntos: 150,
            estudianteId: ana.id,
            fecha: new Date()
        }
    })

    await prisma.logro.create({
        data: {
            tipo: 'primera_pirueta',
            nombre: 'Primera Pirueta',
            descripcion: 'Completar la primera pirueta perfecta',
            icono: '🩰',
            puntos: 50,
            estudianteId: ana.id,
            fecha: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        }
    })

    await prisma.logro.create({
        data: {
            tipo: 'artista_completa',
            nombre: 'Artista Completa',
            descripcion: 'Dominar 3 estilos diferentes',
            icono: '🌟',
            puntos: 200,
            estudianteId: lupita.id,
            fecha: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
        }
    })

    console.log('💰 Creando pagos...')

    // Crear pagos
    await prisma.pago.create({
        data: {
            concepto: 'Mensualidad Enero 2026',
            monto: 750,
            fechaVenc: new Date('2026-01-27'),
            estado: 'vencido',
            tutorId: padre.id,
            estudianteNombre: 'Ana García'
        }
    })

    await prisma.pago.create({
        data: {
            concepto: 'Mensualidad Febrero 2026',
            monto: 1200,
            fechaVenc: new Date('2026-02-05'),
            estado: 'pendiente',
            tutorId: padre.id,
            estudianteNombre: 'Ana + Lupita'
        }
    })

    await prisma.pago.create({
        data: {
            concepto: 'Inscripción Recital Primavera',
            monto: 500,
            fechaVenc: new Date('2026-03-10'),
            estado: 'pendiente',
            tutorId: padre.id,
            estudianteNombre: 'Ana García'
        }
    })

    await prisma.pago.create({
        data: {
            concepto: 'Vestuario Recital',
            monto: 850,
            fechaVenc: new Date('2026-02-28'),
            estado: 'pendiente',
            tutorId: padre.id,
            estudianteNombre: 'Ana + Lupita'
        }
    })

    console.log('🎭 Creando eventos...')

    // Crear eventos
    await prisma.evento.create({
        data: {
            nombre: 'Recital de Primavera 2026',
            tipo: 'recital',
            fecha: new Date('2026-03-15T18:00:00'),
            ubicacion: 'Teatro Municipal',
            descripcion: 'Presentación anual de todas las especialidades. Participan todos los niveles.',
            banner: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800'
        }
    })

    await prisma.evento.create({
        data: {
            nombre: 'Ensayo General',
            tipo: 'ensayo',
            fecha: new Date('2026-03-12T15:00:00'),
            ubicacion: 'Academia - Salón Principal',
            descripcion: 'Ensayo obligatorio para todas las participantes del recital',
            banner: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800'
        }
    })

    await prisma.evento.create({
        data: {
            nombre: 'Showcase de Verano',
            tipo: 'showcase',
            fecha: new Date('2026-06-20T17:00:00'),
            ubicacion: 'Centro Cultural',
            descripcion: 'Presentación de fin de curso con lo mejor de cada grupo',
            banner: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800'
        }
    })

    console.log('✅ Base de datos poblada con datos de ejemplo')
    console.log('')
    console.log('👤 Usuarios de prueba:')
    console.log('   - Padre: padre@demo.com / demo123')
    console.log('   - Maestra: maestra@demo.com / demo123')
    console.log('   - Admin: admin@demo.com / demo123')
}

main()
    .catch((e) => {
        console.error('❌ Error al poblar la base de datos:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
