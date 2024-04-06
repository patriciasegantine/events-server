import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export const getEvent = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get(
      '/event/:eventId',
      {
        schema: {
          params: z.object({
            eventId: z.string().uuid()
          }),
          
          response: {
            200: z.object({
              event: z.object({
                id: z.string().uuid(),
                title: z.string(),
                details: z.string().nullable(),
                slug: z.string(),
                maximumParticipant: z.number().int().nullable(),
                participantsAmount: z.number().int(),
              })
            })
          }
        }
      },
      async (request, reply) => {
        const {eventId} = request.params
        
        const event = await prisma.event.findUnique({
          select: {
            id: true,
            title: true,
            details: true,
            slug: true,
            _count: {
              select: {
                participants: true
              }
            },
            maximumParticipant: true,
            participants: true,
          },
          where: {id: eventId}
        })
        
        if (event === null) {
          throw new Error("Event not found")
        }
        
        return reply.send({
          event: {
            id: event.id,
            title: event.title,
            details: event.details,
            slug: event.slug,
            maximumParticipant: event.maximumParticipant,
            participantsAmount: event._count.participants,
          }
        })
        
      })
}
