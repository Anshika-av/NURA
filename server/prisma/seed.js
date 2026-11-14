require('dotenv').config();
const { getPrisma, disconnectPrisma } = require('../src/config/db');

const symptoms = [
  { name: 'Cramps', category: 'Pain' },
  { name: 'Headache', category: 'Pain' },
  { name: 'Back pain', category: 'Pain' },
  { name: 'Fatigue', category: 'Energy' },
  { name: 'Bloating', category: 'Digestive' },
  { name: 'Nausea', category: 'Digestive' },
  { name: 'Mood changes', category: 'Mood' },
  { name: 'Acne', category: 'Skin' },
  { name: 'Breast tenderness', category: 'Physical' },
];

const seed = async () => {
  const prisma = getPrisma();

  for (const symptom of symptoms) {
    await prisma.symptom.upsert({
      where: {
        name_category: symptom,
      },
      update: {},
      create: symptom,
    });
  }
};

seed()
  .catch((error) => {
    console.error('Failed to seed the symptom catalogue', error);
    process.exitCode = 1;
  })
  .finally(disconnectPrisma);
