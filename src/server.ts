import fastify from "fastify";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

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
    
    const data = createEventSchema.parse(request.body)
    
    const event = await prisma.event.create({
      data: {
        title: data.title,
        details: data.details,
        maximumParticipant: data.maximumParticipant,
        slug: 'ososidosid'
      }
    })
    
    return reply.status(201).send({eventId: event.id})
  })

app.listen({port: 3333}).then(() => console.log('HTTP server running at port 3333!'))
