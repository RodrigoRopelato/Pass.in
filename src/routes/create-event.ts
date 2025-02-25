import { ZodTypeProvider } from "fastify-type-provider-zod"
import {z} from "zod"
import { generateSlug } from "../utils/generat-slug"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"
import { BadRequest } from "./_errors/bad-request"

export async function createEvent(app: FastifyInstance) {

    
    app
    .withTypeProvider<ZodTypeProvider>()
    .post('/events',{
        schema:{
            summary:'Create an Event',
            tags:['events'],
            body: z.object({
                title: z.string().min(4),
                details: z.string().nullable(),
                maximumAttendees: z.number().int().positive().nullable(),
            }),
            response:{
                201: z.object({
                    eventId: z.string().uuid(),
                })
            },
        }
    },async (request, reply)=>{
        
        const data = request.body
        
        const slug = generateSlug(data.title)
        
        const eventWithSameSlug = await prisma.event.findUnique({
            where: {
                slug,
            }
        })
        
        if(eventWithSameSlug !== null) {
            throw new BadRequest('Another event with same title already exists.')
        }
        
        const event = await prisma.event.create({
            data:{
                title: data.title,
                details: data.details,
                maximumAttendees: data.maximumAttendees,
                slug,
            }
        })
        
        return reply.status(201).send({ eventId: event.id})
    })
}