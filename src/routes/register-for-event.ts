import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequestError } from "./_erros/bad-request-error";

export const registerForEvent = async (app: FastifyInstance) => {
  
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/events/:eventId/participant', {
        schema: {
          summary: 'Register a participant',
          tags: ['participant'],
          body: z.object({
            name: z.string().min(3).max(50),
            email: z.string().email(),
          }),
          params: z.object({
            eventId: z.string().uuid()
          }),
          response: {
            201: z.object({
              participantId: z.number()
            })
          }
        }
      },
      async (request, reply) => {
        const {name, email} = request.body
        const {eventId} = request.params
        
        const [event, amountOfParticipantForEvent] = await Promise.all([
          prisma.event.findUnique({
            where: {id: eventId}
          }),
          
          prisma.participant.count({
            where: {eventId}
          })
        ])
        
        if (event?.maximumParticipant && amountOfParticipantForEvent >= event?.maximumParticipant) {
          throw new BadRequestError('The maximum number of participants allowed for this event has been reached')
        }
        
        const participantFromEmail = await prisma.participant.findUnique({
          where: {
            eventId_email: {
              email,
              eventId
            }
          }
        })
        
        if (participantFromEmail) {
          throw new BadRequestError('This email is already registered for this event')
        }
        
        const participant = await prisma.participant.create({
          data: {
            name,
            email,
            eventId
          }
        })
        
        return reply.status(201).send({participantId: participant.id})
        
      }
    )
}
