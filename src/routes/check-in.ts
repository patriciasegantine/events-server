import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequestError } from "./_erros/bad-request-error";

export const checkIn = async (app: FastifyInstance) => {
  
  app
    .withTypeProvider<ZodTypeProvider>()
    .get(
      '/participant/:participantId/check-in',
      {
        schema: {
          summary: 'Check-in an participant',
          tags: ['check-in'],
          params: z.object({
            participantId: z.coerce.number().int()
          }),
          
          response: {
            201: z.string()
          }
        }
      },
      async (request, reply) => {
        
        const {participantId} = request.params
        
        const participantCheckIn = await prisma.checkIn.findUnique({
          where: {
            participantId
          }
        })
        
        if (participantCheckIn !== null) {
          throw new BadRequestError('Participant already checked-in!')
        }
        
        await prisma.checkIn.create({
          data: {
            participantId
          }
        })
        
        return reply.status(201).send('successful checked-in!')
      }
    )
}
