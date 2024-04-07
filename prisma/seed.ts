import { prisma } from "../src/lib/prisma";
import { faker } from "@faker-js/faker";
import { generateSlug } from "../src/utils/generate-slug";

const generateRandomEvent = () => {
  
  const title = `${faker.music.songName()} Event`
  const details = faker.lorem.words(10)
  const maximumParticipant = faker.datatype.number({min: 50, max: 200})
  const slug = generateSlug(title)
  
  return {
    title,
    details,
    maximumParticipant,
    slug
  };
}

const seedOneEvent = async () => {
  const eventData = generateRandomEvent();
  await prisma.event.create({
    data: eventData
  })
}

seedOneEvent().then(() => {
  console.log('Register add at database!');
  prisma.$disconnect();
});
