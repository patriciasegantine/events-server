import { FastifyInstance } from "fastify";
import { BadRequestError } from "../routes/_erros/bad-request-error";
import { ZodError } from "zod";

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  
  const {validation, validationContext} = error
  
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: `Error validating ${validationContext}`,
      errors: error.flatten().fieldErrors
    })
  }
  
  if (error instanceof BadRequestError) {
    return reply.status(400).send(error.message)
  }
  
  return reply.status(500).send('Internal server error!')
  
}
