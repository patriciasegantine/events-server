import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequestError } from "./_erros/bad-request-error";

// todo: add nanoid to show on badge

export const getParticipantBadge = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get(
      '/participants/:participantId/badge',
      {
        schema: {
          summary: 'Register a participant',
          tags: ['participant'],
          
          params: z.object({
            participantId: z.coerce.number().int()
          }),
          
          response: {
            200: z.object({
              badge: z.object({
                name: z.string(),
                email: z.string().email(),
                eventTitle: z.string(),
                checkInUrl: z.string().url(),
              })
            })
          }
        }
      },
      async (request, reply) => {
        
        const {participantId} = request.params
        
        const participant = await prisma.participant.findUnique({
          select: {
            name: true,
            email: true,
            event: {
              select: {
                title: true,
              }
            }
          },
          
          where: {
            id: participantId
          }
        })
        
        if (participant === null) {
          throw new BadRequestError('Participant not found')
        }
        
        const baseUrl = `${request.protocol}://${request.hostname}`
        
        const checkInUrl = new URL(`/participant/${participantId}/check-in`, baseUrl)
        
        console.log(baseUrl)
        
        return reply.send({
          badge: {
            name: participant.name,
            email: participant.email,
            eventTitle: participant.event.title,
            checkInUrl: checkInUrl.toString()
          }
        })
        
      })
}
