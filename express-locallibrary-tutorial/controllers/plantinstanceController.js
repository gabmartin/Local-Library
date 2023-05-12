const { body, validationResult } = require("express-validator");
const { PlantInstance } = require("../models/plantinstance");
const { Plant } = require("../models/plant");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

// Mostrar lista de PlantInstances.
exports.plantinstance_list = asyncHandler(async (req, res, next) => {
  const allPlantInstances = await PlantInstance.find().populate("plant").exec();

  res.render("plantinstance_list", {
    title: "Stock de plantas",
    plantinstance_list: allPlantInstances,
  });
});

// Mostrar página de detalles para un específico PlantInstance.
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

// Mostrar formulario de creación de plantinstance en get.
exports.plantinstance_create_get = asyncHandler(async (req, res, next) => {
  const allPlants = await Plant.find({}, "name").exec();

  res.render("plantinstance_form", {
    title: "Crear copia de planta",
    plant_list: allPlants,
  });
});

// Manejar la creación de plantinstance en el post.
exports.plantinstance_create_post = [
  // Validate and sanitize fields.
  body("plant", "La planta debe ser especificada").trim().isLength({ min: 1 }).escape(),
  body("imprint", "La fecha debe ser especificada")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),

  // Solicitud de proceso después de la validación y saneamiento.
  asyncHandler(async (req, res, next) => {
    // Extraiga los errores de validación de una solicitud.
    const errors = validationResult(req);

    // Cree un objeto de plantinstance con datos escapados y recortados.
    const plantInstance = new PlantInstance({
      plant: req.body.plant,
      imprint: req.body.imprint,
      status: req.body.status,
    });

    if (!errors.isEmpty()) {
      // Hay errores.
      // Renderice el formulario nuevamente con valores saneados y mensajes de error.
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
      // Los datos del formulario son válidos
      await plantInstance.save();
      res.redirect(plantInstance.url);
    }
  }),
];

// Mostrar forma de eliminación de planta en Get.
exports.plantinstance_delete_get = asyncHandler(async (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  // Obtener detalles de instancias
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

// Manejar la eliminacionde instancia en el post.
exports.plantinstance_delete_post = asyncHandler(async (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  await PlantInstance.findByIdAndRemove(id);
  res.redirect("/catalog/plantinstances");
});

// Mostrar formulario de actualización de plantinstance en Get.
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

// Manejar la actualización de PlantInstance en la publicación.
exports.plantinstance_update_post = [
  // Validar y sanear campos.
  body("plant", "La planta debe ser especificada").trim().isLength({ min: 1 }).escape(),
  body("imprint", "La fecha debe ser especificada")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),

  // Solicitud de proceso después de la validación y saneamiento.
  asyncHandler(async (req, res, next) => {
    // Extraiga los errores de validación de una solicitud.
    const errors = validationResult(req);

    // Cree un objeto PlantInstance con datos escapados/recortados e ID.
    const plantInstance = new PlantInstance({
      plant: req.body.plant,
      imprint: req.body.imprint,
      status: req.body.status,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // Hay errores.
      // Renderiza el formulario nuevamente, pasando valores y errores saneados.

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
      // Los datos del formulario son válidos.
      await PlantInstance.findByIdAndUpdate(req.params.id, plantInstance, {});
      // Redirigir a la página de detalles.
      res.redirect(plantInstance.url);
    }
  }),
];
