import fastify from "fastify";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { generateSlug } from "./utils/generate-slug";

const app = fastify()

const prisma = new PrismaClient({
  log: ['query']
})

app.get('/', () => {
  return 'Hello!'
})

app.post('/events',
  async (request, reply) => {
    
    const createEventSchema = z.object({
      title: z.string().min(3).max(50),
      details: z.string().min(10).max(100).nullable(),
      maximumParticipant: z.number().int().positive().nullable()
    })
    
    const {title, details, maximumParticipant} = createEventSchema.parse(request.body)
    
    const slug = generateSlug((title))
    
    const eventWithSameSlug = await prisma.event.findUnique({
      where: {
        slug
      }
    })
    
    if (eventWithSameSlug) throw new Error('There is another event with same title')
    
    const event = await prisma.event.create({
      data: {
        title,
        details,
        maximumParticipant,
        slug
      }
    })
    
    return reply.status(201).send({eventId: event.id})
  })

app.listen({port: 3333}).then(() => console.log('HTTP server running at port 3333!'))
