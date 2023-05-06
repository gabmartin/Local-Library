#! /usr/bin/env node

console.log(
  'This script populates some test plants, greenhouses, types and plantinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const { Plant } = require("./models/plant");
const { Greenhouse } = require("./models/greenhouse");
const { Type } = require("./models/type");
const { PlantInstance } = require("./models/plantinstance");

const types = [];
const greenhouses = [];
const plants = [];
const plantinstances = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createTypes();
  await createGreenhouses();
  await createPlants();
  await createPlantInstances();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function typeCreate(name) {
  const type = new Type({ name: name });
  await type.save();
  types.push(type);
  console.log(`Tipo añadido: ${name}`);
}

async function greenhouseCreate(name, location) {
  greenhousedetail = { name: name, location: location };

  const greenhouse = new Greenhouse(greenhousedetail);

  await greenhouse.save();
  greenhouses.push(greenhouse);
  console.log(`Invernadero añadido: ${name} ${location}`);
}

async function plantCreate(name, greenhouse, price, type) {
  plantdetail = {
    name: name,
    greenhouse: greenhouse,
    price: price,
    type: type,
  };
  if (type != false) plantdetail.type = type;

  const plant = new Plant(plantdetail);
  await plant.save();
  plants.push(plant);
  console.log(`Planta añadida: ${name}`);
}

async function plantInstanceCreate(plant, imprint, status) {
  plantinstancedetail = {
    plant: plant,
    imprint: imprint,
    status: status,
  };

  const plantinstance = new PlantInstance(plantinstancedetail);
  await plantinstance.save();
  plantinstances.push(plantinstance);
  console.log(`PlantaInstance añadida: ${imprint}`);
}

async function createTypes() {
  console.log("Añadiendo tipos");
  await Promise.all([
    typeCreate("Interior"),
    typeCreate("Exterior"),
    typeCreate("Huerto"),
  ]);
}

async function createGreenhouses() {
  console.log("Añadiendo invernadero");
  await Promise.all([
    greenhouseCreate("San Juan", "Almeria"),
    greenhouseCreate("Flor azul", "Malaga"),
    greenhouseCreate("Hermanos Marin", "Sevilla"),
    greenhouseCreate("Doña Dolores", "Sevilla"),
    greenhouseCreate("Invernaderos Carmona", "Sevilla"),
  ]);
}

async function createPlants() {
  console.log("Añadiendo plantas");
  await Promise.all([
    plantCreate("Monstera", greenhouses[0], "15", [types[0]]),
    plantCreate("Potos Golden", greenhouses[0], "25", [types[1]]),
    plantCreate("Peperonia", greenhouses[1], "5", [types[2]]),
    plantCreate("Planta carnivora", greenhouses[3], "7", [types[0]]),
    plantCreate("Ficus", greenhouses[1], "9", [types[2]]),
    plantCreate("Hortensia", greenhouses[2], "3", [types[1]]),
    plantCreate("Cactus", greenhouses[2], "45", [types[0]]),
  ]);
}

async function createPlantInstances() {
  console.log("Añadiendo instancias de plantas");
  await Promise.all([
    plantInstanceCreate(plants[0], "Andalucia, 2022.", "Disponible"),
    plantInstanceCreate(plants[0], "Andalucia, 2021.", "Mantenimiento"),
    plantInstanceCreate(plants[1], "Andalucia, 2020.", "Disponible"),
    plantInstanceCreate(plants[1], "Andalucia, 2023.", "Reservada"),
    plantInstanceCreate(plants[2], "Andalucia, 2023.", "Mantenimiento"),
    plantInstanceCreate(plants[3], "Andalucia, 2022.", "Reservada"),
    plantInstanceCreate(plants[3], "Andalucia, 2021.", "Mantenimiento"),
    plantInstanceCreate(plants[3], "Andalucia, 2022.", "Disponible"),
    plantInstanceCreate(plants[4], "Andalucia, 2020.", "Reservada"),
    plantInstanceCreate(plants[4], "Andalucia, 2023.", "Mantenimiento"),
    plantInstanceCreate(plants[5], "Andalucia, 2023.", "Reservada"),
    plantInstanceCreate(plants[5], "Andalucia, 2022.", "Disponible"),
  ]);
}
