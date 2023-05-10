const { body, validationResult } = require("express-validator");
const {Plant} = require("../models/plant");
const {Greenhouse} = require("../models/greenhouse");
const {Type} = require("../models/type");
const {PlantInstance} = require("../models/plantinstance");
const mongoose = require("mongoose");
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
  const id = mongoose.Types.ObjectId(req.params.id);
  // Get details of plants, plant instances for specific plant
  const [plant, plantInstances] = await Promise.all([
    Plant.findById(id).populate("greenhouse").populate("type").exec(),
    PlantInstance.find({ plant: id }).exec(),
  ]);

  if (plant === null) {
    // No results.
    const err = new Error("Plant not found");
    err.status = 404;
    return next(err);
  }

  res.render("plant_detail", {
    title: plant.name,
    plant: plant,
    plant_instances: plantInstances,
  });
});


// Display plant create form on GET.
exports.plant_create_get = asyncHandler(async (req, res, next) => {
  // Get all greenhouses and types, which we can use for adding to our plant.
  const [allGreenhouses, allTypes] = await Promise.all([
    Greenhouse.find().exec(),
    Type.find().exec(),
  ]);

  res.render("plant_form", {
    title: "Create Plant",
    greenhouses: allGreenhouses,
    types: allTypes,
  });
});


// Handle plant create on POST.
exports.plant_create_post = [
  // Convert the type to an array.
  (req, res, next) => {
    if (!(req.body.type instanceof Array)) {
      if (typeof req.body.type === "undefined") req.body.type = [];
      else req.body.type = new Array(req.body.type);
    }
    next();
  },

  // Validate and sanitize fields.
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("greenhouse", "Greenhouse must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("type.*").escape(),
  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Plant object with escaped and trimmed data.
    const plant = new Plant({
      name: req.body.name,
      greenhouse: req.body.greenhouse,
      price: req.body.price,
      type: req.body.type,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all greenhouses and types for form.
      const [allGreenhouses, allTypes] = await Promise.all([
        Greenhouse.find().exec(),
        Type.find().exec(),
      ]);

      // Mark our selected types as checked.
      for (const type of allTypes) {
        if (plant.type.indexOf(type._id) > -1) {
          type.checked = "true";
        }
      }
      res.render("plant_form", {
        title: "Create Plant",
        greenhouses: allGreenhouses,
        types: allTypes,
        plant: plant,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save plant.
      await plant.save();
      res.redirect(plant.url);
    }
  }),
];

// Display plant delete form on GET.
exports.plant_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of plant and all their instances (in parallel)
  const [plant, allInstancesByPlant] = await Promise.all([
    Plant.findById(req.params.id).exec(),
    PlantInstance.find({ plant: req.params.id }, "imprint status").exec(),
  ]);

  if (plant === null) {
    // No results.
    res.redirect("/catalog/plants");
  }

  res.render("plant_delete", {
    title: "Delete Plant",
    plant: plant,
    plant_instances: allInstancesByPlant,
  });
});


// Handle Greenhouse delete on POST.
exports.plant_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of greenhouse and all their plants (in parallel)
  const [plant, allInstancesByPlant] = await Promise.all([
    Plant.findById(req.params.id).exec(),
    PlantInstance.find({ plant: req.params.id }, "imprint status").exec(),
  ]);

  if (allInstancesByPlant.length > 0) {
    // Greenhouse has plants. Render in same way as for GET route.
    res.render("plant_delete", {
      title: "Delete Plant",
      plant: plant,
      plant_instances: allInstancesByPlant,
    });
    return;
  } else {
    // Greenhouse has no plants. Delete object and redirect to the list of greenhouses.
    await Plant.findByIdAndRemove(req.body.plantid);
    res.redirect("/catalog/plants");
  }
});

// Display plant update form on GET.
exports.plant_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Plant update GET");
});

// Handle plant update on POST.
exports.plant_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Plant update POST");
});
