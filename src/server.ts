import fastify from "fastify";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { createEvent } from "./routes/create-event";
import { registerForEvent } from "./routes/register-for-event";
import { getEvent } from "./routes/get-event";
import { getParticipantBadge } from "./routes/get-participant-badge";
import { checkIn } from "./routes/check-in";
import { getEventParticipants } from "./routes/get-event-participants";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { errorHandler } from "./utils/error-handler";
import fastifyCors from "@fastify/cors";

const app = fastify()

app.register(fastifyCors, {
  origin: '*'
})

app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'Event',
      description: '',
      version: '1.0.0'
    }
  },
  transform: jsonSchemaTransform
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs'
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)
app.register(getParticipantBadge)
app.register(checkIn)
app.register(getEventParticipants)

app.setErrorHandler(errorHandler)

app.listen({port: 3333, host: '0.0.0.0'}).then(() => console.log('HTTP server running at port 3333!'))
