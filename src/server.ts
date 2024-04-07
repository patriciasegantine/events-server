import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { createEvent } from "./routes/create-event";
import { registerForEvent } from "./routes/register-for-event";
import { getEvent } from "./routes/get-event";
import { getParticipantBadge } from "./routes/get-participant-badge";
import { checkIn } from "./routes/check-in";
import { getEventParticipants } from "./routes/get-event-participants";

const app = fastify()

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)
app.register(getParticipantBadge)
app.register(checkIn)
app.register(getEventParticipants)

app.listen({port: 3333}).then(() => console.log('HTTP server running at port 3333!'))
