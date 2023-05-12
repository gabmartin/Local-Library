const { body, validationResult } = require("express-validator");
const {Plant} = require("../models/plant");
const {Greenhouse} = require("../models/greenhouse");
const {Type} = require("../models/type");
const {PlantInstance} = require("../models/plantinstance");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  // Obtenga detalles de plantas, instancias de plantas, invernaderos y recuentos de tipos (en paralelo)
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


// Lista de visualización de todas las plantas.
exports.plant_list = asyncHandler(async (req, res, next) => {
  const allPlants = await Plant.find({}, "name greenhouse")
    .sort({ name: 1 })
    .populate("greenhouse")
    .exec();

  res.render("plant_list", { title: "Lista de plantas", plant_list: allPlants });
});


// Mostrar página de detalles para una planta específica.
exports.plant_detail = asyncHandler(async (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  // Obtenga detalles de plantas, instancias de plantas para plantas específicas
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


// Mostrar la creación de planta en formulario en Get.
exports.plant_create_get = asyncHandler(async (req, res, next) => {
  // Obtenga todos los invernaderos y tipos, que podemos usar para agregar a nuestra planta.
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


// Manejar la creación de la planta en el post.
exports.plant_create_post = [
  // Convierta el tipo en una matriz.
  (req, res, next) => {
    if (!(req.body.type instanceof Array)) {
      if (typeof req.body.type === "undefined") req.body.type = [];
      else req.body.type = new Array(req.body.type);
    }
    next();
  },

  // Validar y sanear campos.
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
  // Solicitud de proceso después de la validación y saneamiento.

  asyncHandler(async (req, res, next) => {
    // Extraiga los errores de validación de una solicitud.
    const errors = validationResult(req);

    // Cree un objeto Planta con datos escapados y recortados.
    const plant = new Plant({
      name: req.body.name,
      greenhouse: req.body.greenhouse,
      price: req.body.price,
      type: req.body.type,
    });

    if (!errors.isEmpty()) {
      // Hay errores. Renderice el formulario nuevamente con valores saneados/mensajes de error.

      // Obtenga todos los invernaderos y tipos para el formulario.
      const [allGreenhouses, allTypes] = await Promise.all([
        Greenhouse.find().exec(),
        Type.find().exec(),
      ]);

      // Marque nuestros tipos seleccionados como se verifica.
      for (const type of allTypes) {
        if (plant.type.indexOf(type._id) > -1) {
          type.checked = "true";
        }
      }
      res.render("plant_form", {
        title: "Crear planta",
        greenhouses: allGreenhouses,
        types: allTypes,
        plant: plant,
        errors: errors.array(),
      });
    } else {
      // Los datos del formulario son válidos. Guardar planta.
      await plant.save();
      res.redirect(plant.url);
    }
  }),
];

// Mostrar forma de eliminación de planta en Get.
exports.plant_delete_get = asyncHandler(async (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  // Obtenga detalles de la planta y todas sus instancias (en paralelo)
  const [plant, allInstancesByPlant] = await Promise.all([
    Plant.findById(id).exec(),
    PlantInstance.find({ plant: id }, "imprint status").exec(),
  ]);

  if (plant === null) {
    // No results.
    res.redirect("/catalog/plants");
  }

  res.render("plant_delete", {
    title: "Borrar planta",
    plant: plant,
    plant_instances: allInstancesByPlant,
  });
});

// Manejar el invernadero. Eliminar en el Post.
exports.plant_delete_post = asyncHandler(async (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  // Obtenga detalles del invernadero y todas sus plantas (en paralelo)
  const [plant, allInstancesByPlant] = await Promise.all([
    Plant.findById(id).exec(),
    PlantInstance.find({ plant: id }, "imprint status").exec(),
  ]);

  if (allInstancesByPlant.length > 0) {
    // El invernadero tiene plantas. Renderizar de la misma manera que para obtener la ruta.
    res.render("plant_delete", {
      title: "Borrar planta",
      plant: plant,
      plant_instances: allInstancesByPlant,
    });
    return;
  } else {
    // El invernadero no tiene plantas. Elimine el objeto y redirige a la lista de invernaderos.
    await Plant.findByIdAndRemove(req.body.plantid);
    res.redirect("/catalog/plants");
  }
});

// Mostrar formulario de actualización de la planta en Get.
exports.plant_update_get = asyncHandler(async (req, res, next) => {
  // Obtenga planta, invernaderos y tipos para el formulario.
  const [plant, allGreenhouses, allTypes] = await Promise.all([
    Plant.findById(req.params.id).populate("greenhouse").populate("type").exec(),
    Greenhouse.find().exec(),
    Type.find().exec(),
  ]);

  if (plant === null) {
    // No results.
    const err = new Error("Plant not found");
    err.status = 404;
    return next(err);
  }

  // Marque nuestros tipos seleccionados como se verifica.
  for (const type of allTypes) {
    for (const plant_g of plant.type) {
      if (type._id.toString() === plant_g._id.toString()) {
        type.checked = "true";
      }
    }
  }

  res.render("plant_form", {
    title: "Actualizar planta",
    greenhouses: allGreenhouses,
    types: allTypes,
    plant: plant,
  });
});

// Maneje la actualización de la planta en la publicación.
exports.plant_update_post = [
  // Convierta el tipo en una matriz.
  (req, res, next) => {
    if (!(req.body.type instanceof Array)) {
      if (typeof req.body.type === "undefined") {
        req.body.type = [];
      } else {
        req.body.type = new Array(req.body.type);
      }
    }
    next();
  },

  // Validar y sanear campos.
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

  // Solicitud de proceso después de la validación y saneamiento.
  asyncHandler(async (req, res, next) => {
    // Extraer los errores de validación de una solicitud.
    const errors = validationResult(req);

    // Cree un objeto Planta con datos escapados/recortados e ID antigua.
    const plant = new Plant({
      name: req.body.name,
      greenhouse: req.body.greenhouse,
      price: req.body.price,
      type: typeof req.body.type === "undefined" ? [] : req.body.type,
      _id: req.params.id, // Requerido o se asignará una nueva identificación.
    });

    if (!errors.isEmpty()) {
      // Hay errores. Renderice el formulario nuevamente con valores saneados/mensajes de error.

      // Obtenga todos los invernaderos y tipos para su forma.
      const [allGreenhouses, allTypes] = await Promise.all([
        Greenhouse.find().exec(),
        Type.find().exec(),
      ]);

      // Marcar los tipos seleccionados como se verifica.
      for (const type of allTypes) {
        if (plant.type.indexOf(types._id) > -1) {
          type.checked = "true";
        }
      }
      res.render("plant_form", {
        title: "Actualizar planta",
        greenhouses: allGreenhouses,
        types: allTypes,
        plant: plant,
        errors: errors.array(),
      });
      return;
    } else {
      // Los datos del formulario son válidos. Actualizar el registro.
      const theplant = await Plant.findByIdAndUpdate(req.params.id, plant, {});
      // Redirigir a la página de detalles de la planta.
      res.redirect(theplant.url);
    }
  }),
];

