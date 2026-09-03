import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const C = {
  blue: "#3B9EF5",
  cyan: "#56C8E7",
  green: "#53C87A",
  yellow: "#FFD05B",
  orange: "#FF811E",
  red: "#F35358",
  pink: "#D75AD5",
  purple: "#AC31E3",
} as const;

const LONG_TITLE = "Ceci est un titre long sur 2 lignes pour une flotte";
const LONG_DESC =
  "Toutes les startups de l’incubateur HEC qu’importe l’année de leur promotion et de leur secteur";
const NO_DESC = "Renseignez une description dans les paramètres de la flotte";

// Sample directory, roughly mirroring the Figma mock. Order matters: the first
// entry is written with the newest timestamp so it lands on top of the list.
const fleets: Array<{
  name: string;
  description: string;
  color: string;
  companies: number;
}> = [
  { name: "Incubateur HEC", description: "Toutes les startups de l’incubateur HEC", color: C.blue, companies: 128 },
  { name: LONG_TITLE, description: LONG_DESC, color: C.purple, companies: 342 },
  { name: "Startups Station F", description: "Le plus grand campus de startups au monde", color: C.cyan, companies: 1000 },
  { name: "Réseau French Tech", description: "Les pépites labellisées French Tech", color: C.green, companies: 217 },
  { name: "Portefeuille SaaS B2B", description: NO_DESC, color: C.yellow, companies: 54 },
  { name: "Scale-ups européennes", description: "Entreprises en hypercroissance sur le marché européen", color: C.orange, companies: 76 },
  { name: LONG_TITLE, description: NO_DESC, color: C.red, companies: 12 },
  { name: "Fintech France", description: "Néobanques, paiement et assurtech", color: C.blue, companies: 89 },
  { name: "Greentech & Impact", description: "Startups à impact environnemental positif", color: C.green, companies: 143 },
  { name: "Deeptech CNRS", description: "Spin-offs issues de la recherche publique", color: C.pink, companies: 61 },
  { name: "Promotion 2024", description: "Cohorte de l’accélérateur, promotion 2024", color: C.purple, companies: 32 },
  { name: "Marketplaces", description: "Plateformes de mise en relation B2C et B2B", color: C.cyan, companies: 47 },
  { name: "HealthTech", description: "E-santé, dispositifs médicaux et biotech", color: C.red, companies: 98 },
  { name: "Mobilité durable", description: "Transport, logistique et micro-mobilité", color: C.orange, companies: 65 },
  { name: "Incubateur HEC", description: LONG_DESC, color: C.blue, companies: 128 },
  { name: "EdTech", description: "Formation, e-learning et outils pédagogiques", color: C.yellow, companies: 73 },
  { name: "Cybersécurité", description: NO_DESC, color: C.green, companies: 41 },
  { name: "Intelligence artificielle", description: "Modèles, infrastructure et applications IA", color: C.purple, companies: 204 },
  { name: "Retail & E-commerce", description: "Commerce en ligne et distribution", color: C.pink, companies: 156 },
  { name: "Foodtech", description: "Agroalimentaire, restauration et livraison", color: C.orange, companies: 84 },
  { name: LONG_TITLE, description: LONG_DESC, color: C.cyan, companies: 5 },
  { name: "PropTech", description: "Immobilier et construction connectés", color: C.blue, companies: 38 },
  { name: "Industrie 4.0", description: "Usine connectée et robotique", color: C.red, companies: 52 },
  { name: "Promotion 2023", description: "Cohorte de l’accélérateur, promotion 2023", color: C.green, companies: 29 },
  { name: "LegalTech", description: NO_DESC, color: C.yellow, companies: 22 },
  { name: "SpaceTech", description: "New space, satellites et observation", color: C.purple, companies: 17 },
  { name: "Gaming & Divertissement", description: "Jeux vidéo, streaming et médias", color: C.pink, companies: 63 },
  { name: "AgriTech", description: "Agriculture de précision et robotique agricole", color: C.green, companies: 44 },
  { name: "Startups Station F", description: LONG_DESC, color: C.cyan, companies: 1000 },
  { name: "HRTech", description: "Recrutement, paie et gestion des talents", color: C.orange, companies: 57 },
  { name: "InsurTech", description: "Assurance à la demande et courtage digital", color: C.blue, companies: 33 },
  { name: "Web3 & Blockchain", description: NO_DESC, color: C.purple, companies: 71 },
  { name: LONG_TITLE, description: NO_DESC, color: C.yellow, companies: 3 },
  { name: "Climate Tech", description: "Décarbonation et énergies renouvelables", color: C.green, companies: 112 },
  { name: "Hardware & IoT", description: "Objets connectés et électronique", color: C.red, companies: 46 },
  { name: "Réseau French Tech", description: "Les pépites labellisées French Tech", color: C.cyan, companies: 217 },
  { name: "Promotion 2022", description: "Cohorte de l’accélérateur, promotion 2022", color: C.pink, companies: 26 },
  { name: "Média & Presse", description: NO_DESC, color: C.orange, companies: 39 },
  { name: "Tourisme & Voyage", description: "Réservation, expériences et hôtellerie", color: C.blue, companies: 48 },
  { name: "Sport & Bien-être", description: "Fitness, nutrition et santé connectée", color: C.green, companies: 55 },
  { name: "Robotique de service", description: "Automatisation et cobotique", color: C.purple, companies: 19 },
  { name: "Énergie & Réseaux", description: "Smart grid, stockage et efficacité", color: C.yellow, companies: 67 },
];

async function main() {
  await prisma.fleet.deleteMany();

  const base = Date.now();
  // Space timestamps 1s apart so `orderBy createdAt desc` keeps the array order.
  for (let index = 0; index < fleets.length; index += 1) {
    const fleet = fleets[index];
    await prisma.fleet.create({
      data: {
        ...fleet,
        createdAt: new Date(base - index * 1000),
      },
    });
  }

  console.log(`Seeded ${fleets.length} fleets.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
