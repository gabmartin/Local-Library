const { body, validationResult } = require("express-validator");
const { Greenhouse } = require("../models/greenhouse");
const asyncHandler = require('express-async-handler');
const { Plant } = require("../models/plant");
const mongoose = require("mongoose");

// Lista de visualización de todos los invernaderos.
exports.greenhouse_list = asyncHandler(async (req, res, next) => {
  const allGreenhouses = await Greenhouse.find().sort({ name: 1 }).exec();
  res.render("greenhouse_list", {
    title: "Lista de invernaderos",
    greenhouse_list: allGreenhouses,
  });
});


// Muestra la página de detalles de un invernadero específico.
exports.greenhouse_detail = asyncHandler(async (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  // Obtener detalles del invernadero y todas sus plantas (en paralelo)
  const [greenhouse, allPlantsByGreenhouse] = await Promise.all([
    Greenhouse.findById(id).exec(),
    Plant.find({ greenhouse: id }, "name price").exec(),
  ]);

  if (greenhouse === null) {
    // No results.
    const err = new Error("No se ha encontrado el invernadero");
    err.status = 404;
    return next(err);
  }

  res.render("greenhouse_detail", {
    title: "Lista de invernaderos",
    greenhouse: greenhouse,
    greenhouse_plants: allPlantsByGreenhouse,
  });
});

// Muestre el formulario de creación de invernadero en GET.
exports.greenhouse_create_get = (req, res, next) => {
  res.render("greenhouse_form", { title: "Crear invernadero" });
};

// Manejar la creación de invernadero en POST.
exports.greenhouse_create_post = [
  // Validar y sanear campos.
  body("name")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("Debes especificar el nombre."),
    body("location")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("Debes especificar la localización."),

  // Solicitud de proceso después de la validación y saneamiento.
  asyncHandler(async (req, res, next) => {
    // Extraiga los errores de validación de una solicitud.
    const errors = validationResult(req);

    // Crear objeto de invernadero con datos escapados y recortados
    const greenhouse = new Greenhouse({
      name: req.body.name,
      location: req.body.location,
    });

    if (!errors.isEmpty()) {
      // Hay errores. Renderice el formulario nuevamente con valores saneados/mensajes de error.
      res.render("greenhouse_form", {
        title: "Crear invernadero",
        greenhouse: greenhouse,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form es valido.

      // Guarda invernadero.
      await greenhouse.save();
      // Redirigir al nuevo registro de invernadero.
      res.redirect(greenhouse.url);
    }
  }),
];

// Muestre el formulario de eliminación de invernadero en GET.
exports.greenhouse_delete_get = asyncHandler(async (req, res, next) => {
  // Muestre el formulario de eliminación de invernadero en GET.
  const [greenhouse, allPlantsByGreenhouse] = await Promise.all([
    Greenhouse.findById(req.params.id).exec(),
    Plant.find({ greenhouse: req.params.id }, "name price").exec(),
  ]);

  if (greenhouse === null) {
    // No results.
    res.redirect("/catalog/greenhouses");
  }

  res.render("greenhouse_delete", {
    title: "Lista de invernaderos",
    greenhouse: greenhouse,
    greenhouse_plants: allPlantsByGreenhouse,
  });
});


// Manejar la eliminación de invernadero en POST.
exports.greenhouse_delete_post = asyncHandler(async (req, res, next) => {
  // Obtener detalles del invernadero y todas sus plantas (en paralelo)
  const [greenhouse, allPlantsByGreenhouse] = await Promise.all([
    Greenhouse.findById(req.params.id).exec(),
    Plant.find({ greenhouse: req.params.id }, "name price").exec(),
  ]);

  if (allPlantsByGreenhouse.length > 0) {
    // El invernadero tiene plantas. Renderizar de la misma manera que para obtener la ruta.
    res.render("greenhouse_delete", {
      title: "Lista de invernaderos",
      greenhouse: greenhouse,
      greenhouse_plants: allPlantsByGreenhouse,
    });
    return;
  } else {
    // El invernadero no tiene plantas. Eliminar objeto y redirigir a la lista de invernaderos.
    await Greenhouse.findByIdAndRemove(req.body.greenhouseid);
    res.redirect("/catalog/greenhouses");
  }
});


// Mostrar formulario de actualización de invernadero en Get.
exports.greenhouse_update_get = asyncHandler(async (req, res, next) => {
  const greenhouse = await Greenhouse.findById(req.params.id).exec();
  if (greenhouse === null) {
    // No results.
    const err = new Error("No se ha encontrado el invernadero.");
    err.status = 404;
    return next(err);
  }

  res.render("greenhouse_form", { title: "Actualizar invernadero", greenhouse: greenhouse });
});

// Manejar la actualización de invernadero en POST.
exports.greenhouse_update_post = [
  // Validar y sanear campos.
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Debes especificar el nombre."),
  body("location")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Debes especificar la localización."),

  // Solicitud de proceso después de la validación y saneamiento.
  asyncHandler(async (req, res, next) => {
    // Extraer los errores de validación de una solicitud.
    const errors = validationResult(req);

    // Cree objeto de invernadero con datos escapados y recortados (y la antigua identificación)
    const greenhouse = new Greenhouse({
      name: req.body.name,
      location: req.body.location,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // Hay errores. Renderiza el formulario nuevamente con valores saneados y mensajes de error.
      res.render("greenhouse_form", {
        title: "Actualizar invernadero",
        greenhouse: greenhouse,
        errors: errors.array(),
      });
      return;
    } else {
      // Los datos del formulario son válidos. Actualizar el registro.
      await Greenhouse.findByIdAndUpdate(req.params.id, greenhouse);
      res.redirect(greenhouse.url);
    }
  }),
];
