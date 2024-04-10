import {prisma} from '../src/lib/prisma'

async function seed() { 
    await prisma.event.create({
        data: {
            id: 'e1bc8344-c6d4-4ea7-9760-9e3f3d3761fd',
            title: 'Unite Summit',
            slug: 'unite-summit',
            details: 'Um evento para devs apaixonados(as) por código!',
            maximumAttendees: 120,
        }
    })
}

seed().then(() => {
    console.log('Database seeded!')
    prisma.$disconnect()
})

