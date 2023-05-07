const {Plant} = require("../models/plant");
const {Greenhouse} = require("../models/greenhouse");
const {Type} = require("../models/type");
const {PlantInstance} = require("../models/plantinstance");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  // Get details of plants, plant instances, greenhouses and type counts (in parallel)
  const [
    numPlants,
    numPlantInstances,
    numAvailablePlantInstances,
    numGreenhouses,
    numTypes,
  ] = await Promise.all([
    Plant.countDocuments({}).exec(),
    PlantInstance.countDocuments({}).exec(),
    PlantInstance.countDocuments({ status: "Disponible" }).exec(),
    Greenhouse.countDocuments({}).exec(),
    Type.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Local Library Home",
    plant_count: numPlants,
    plant_instance_count: numPlantInstances,
    plant_instance_available_count: numAvailablePlantInstances,
    greenhouse_count: numGreenhouses,
    type_count: numTypes,
  });
});


// Display list of all plants.
exports.plant_list = asyncHandler(async (req, res, next) => {
  const allPlants = await Plant.find({}, "name greenhouse")
    .sort({ name: 1 })
    .populate("greenhouse")
    .exec();

  res.render("plant_list", { title: "Plant List", plant_list: allPlants });
});


// Display detail page for a specific plant.
exports.plant_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Plant detail: ${req.params.id}`);
});

// Display plant create form on GET.
exports.plant_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Plant create GET");
});

// Handle plant create on POST.
exports.plant_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Plant create POST");
});

// Display plant delete form on GET.
exports.plant_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Plant delete GET");
});

// Handle plant delete on POST.
exports.plant_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Plant delete POST");
});

// Display plant update form on GET.
exports.plant_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Plant update GET");
});

// Handle plant update on POST.
exports.plant_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Plant update POST");
});
