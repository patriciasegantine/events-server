import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

// todo: add search by: name, email, createdAt

export const getEventParticipants = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get(
      '/events/:eventId/participants',
      {
        schema: {
          summary: 'Get event participants',
          tags: ['event'],
          params: z.object({
            eventId: z.string().uuid()
          }),
          
          querystring: z.object({
            name: z.string().nullish(),
            pageNumber: z.string().transform(Number),
            pageSize: z.string().transform(Number),
          }),
          response: {
            200: z.object({
              participants: z.array(
                z.object({
                  id: z.number(),
                  name: z.string(),
                  email: z.string().email(),
                  createdAt: z.date(),
                  checkedAt: z.date().nullable(),
                })
              )
            })
          }
        }
      },
      async (request, reply) => {
        
        const {eventId} = request.params
        const {pageNumber, pageSize} = request.query
        
        const participants = await prisma.participant.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            checkIn: {
              select: {
                createdAt: true
              }
            }
          },
          where: {
            eventId
          },
          take: pageSize,
          skip: (pageNumber - 1) * pageSize,
          orderBy: {
            createdAt: 'desc'
          }
        })
        
        return reply.send({
          participants: participants.map((participant) => {
            return {
              id: participant.id,
              name: participant.name,
              email: participant.email,
              createdAt: participant.createdAt,
              checkedAt: participant.checkIn?.createdAt ?? null
            }
          })
        })
      }
    )
  
}
