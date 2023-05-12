const { body, validationResult } = require("express-validator");
const { PlantInstance } = require("../models/plantinstance");
const { Plant } = require("../models/plant");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

// Display list of all PlantInstances.
exports.plantinstance_list = asyncHandler(async (req, res, next) => {
  const allPlantInstances = await PlantInstance.find().populate("plant").exec();

  res.render("plantinstance_list", {
    title: "Stock de plantas",
    plantinstance_list: allPlantInstances,
  });
});

// Display detail page for a specific PlantInstance.
exports.plantinstance_detail = asyncHandler(async (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  const plantInstance = await PlantInstance.findById(id)
    .populate("plant")
    .exec();

  if (plantInstance === null) {
    // No results.
    const err = new Error("Copia de planta no encontrada.");
    err.status = 404;
    return next(err);
  }

  res.render("plantinstance_detail", {
    title: "Planta:",
    plantinstance: plantInstance,
  });
});

// Display PlantInstance create form on GET.
exports.plantinstance_create_get = asyncHandler(async (req, res, next) => {
  const allPlants = await Plant.find({}, "name").exec();

  res.render("plantinstance_form", {
    title: "Crear copia de planta",
    plant_list: allPlants,
  });
});

// Handle PlantInstance create on POST.
exports.plantinstance_create_post = [
  // Validate and sanitize fields.
  body("plant", "La planta debe ser especificada").trim().isLength({ min: 1 }).escape(),
  body("imprint", "La fecha debe ser especificada")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a PlantInstance object with escaped and trimmed data.
    const plantInstance = new PlantInstance({
      plant: req.body.plant,
      imprint: req.body.imprint,
      status: req.body.status,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again with sanitized values and error messages.
      const allPlants = await Plant.find({}, "title").exec();

      res.render("plantinstance_form", {
        title: "Crear copia de planta",
        plant_list: allPlants,
        selected_plant: plantInstance.plant._id,
        errors: errors.array(),
        plantinstance: plantInstance,
      });
      return;
    } else {
      // Data from form is valid
      await plantInstance.save();
      res.redirect(plantInstance.url);
    }
  }),
];

// Display plant delete form on GET.
exports.plantinstance_delete_get = asyncHandler(async (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  // Get details of instances
  const plantInstance = await PlantInstance.findById(id).exec();

  if (plantInstance === null) {
    // No results.
    res.redirect("/catalog/plantintances");
  }

  res.render("plantinstance_delete", {
    title: "Borrar copia de planta",
    plantInstance: plantInstance,
  });
});

// Handle Greenhouse delete on POST.
exports.plantinstance_delete_post = asyncHandler(async (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  await PlantInstance.findByIdAndRemove(id);
  res.redirect("/catalog/plantinstances");
});

// Display plantInstance update form on GET.
exports.plantinstance_update_get = asyncHandler(async (req, res, next) => {
  // Get plant, all plants for form (in parallel)
  const [plantInstance, allPlants] = await Promise.all([
    PlantInstance.findById(req.params.id).populate("plant").exec(),
    Plant.find(),
  ]);

  if (plantInstance === null) {
    // No results.
    const err = new Error("Copia de planta no encontrada");
    err.status = 404;
    return next(err);
  }

  res.render("plantinstance_form", {
    title: "Actualizar copia de planta",
    plant_list: allPlants,
    selected_plant: plantInstance.plant._id,
    plantinstance: plantInstance,
  });
});

// Handle plantInstance update on POST.
exports.plantinstance_update_post = [
  // Validate and sanitize fields.
  body("plant", "La planta debe ser especificada").trim().isLength({ min: 1 }).escape(),
  body("imprint", "La fecha debe ser especificada")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a plantInstance object with escaped/trimmed data and current id.
    const plantInstance = new PlantInstance({
      plant: req.body.plant,
      imprint: req.body.imprint,
      status: req.body.status,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      // Render the form again, passing sanitized values and errors.

      const allPlants = await Plant.find({}, "name").exec();

      res.render("plantinstance_form", {
        title: "Actualizar copia de planta",
        plant_list: allPlants,
        selected_plant: plantInstance.plant._id,
        errors: errors.array(),
        plantinstance: plantInstance,
      });
      return;
    } else {
      // Data from form is valid.
      await PlantInstance.findByIdAndUpdate(req.params.id, plantInstance, {});
      // Redirect to detail page.
      res.redirect(plantInstance.url);
    }
  }),
];
