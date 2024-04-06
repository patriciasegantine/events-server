import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { generateSlug } from "../utils/generate-slug";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";

export const createEvent = async (app: FastifyInstance) => {
  
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/events',
      {
        schema: {
          body: z.object({
            title: z.string().min(3).max(50),
            details: z.string().min(10).max(100).nullable(),
            maximumParticipant: z.number().int().positive().nullable()
          }),
          
          response: {
            201: z.object({
              eventId: z.string().uuid()
            })
          }
        }
      },
      async (request, reply) => {
        
        const {title, details, maximumParticipant} = request.body
        
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
}
