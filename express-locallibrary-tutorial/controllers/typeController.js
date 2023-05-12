const { body, validationResult } = require("express-validator");
const { Type } = require("../models/type");
const asyncHandler = require("express-async-handler");
const { Plant } = require("../models/plant");
const mongoose = require("mongoose");

// Mostrar lista de todos los tipos.
exports.type_list = asyncHandler(async (req, res, next) => {
  const allTypes = await Type.find().sort({ name: 1 }).exec();
  res.render("type_list", {
    title: "Lista de tipos",
    type_list: allTypes,
  });
});

// Mostrar página de detalles para un tipo específico.
exports.type_detail = asyncHandler(async (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  // Obtenga detalles del tipo y todas las plantas asociadas (en paralelo)
  const [type, plantsInType] = await Promise.all([
    Type.findById(id).exec(),
    Plant.find({ type: id }, "name price").exec(),
  ]);
  if (type === null) {
    // No results.
    const err = new Error("Tipo no encontrado");
    err.status = 404;
    return next(err);
  }

  res.render("type_detail", {
    title: "Detalle de tipo",
    type: type,
    type_plants: plantsInType,
  });
});

// Mostrar Type create form en GET.
exports.type_create_get = (req, res, next) => {
  res.render("type_form", { title: "Crear tipo" });
};

// Manejar Type create en POST.
exports.type_create_post = [
  // Validate and sanitize the name field.
  body("name", "El tipo debe contener al menos 3 caracteres")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Solicitud de proceso después de la validación y desinfección.
  asyncHandler(async (req, res, next) => {
    // Extraiga los errores de validación de una solicitud.
    const errors = validationResult(req);

    // Cree un objeto tipo con datos escapados y recortados.
    const type = new Type({ name: req.body.name });

    if (!errors.isEmpty()) {
      // Hay errores. Renderiza el formulario nuevamente con valores saneados/mensajes de error.
      res.render("type_form", {
        title: "Crear tipo",
        type: type,
        errors: errors.array(),
      });
      return;
    } else {
      // Los datos del formulario son válidos.
      // Verifique si el tipo con el mismo nombre ya existe.
      const typeExists = await Type.findOne({ name: req.body.name }).exec();
      if (typeExists) {
        // El tipo existe, redirige a su página de detalles.
        res.redirect(typeExists.url);
      } else {
        await type.save();
        // Nuevo tipo guardado. Redirigir para escribir la página de detalles.
        res.redirect(type.url);
      }
    }
  }),
];

// Mostrar Type delete form en GET.
exports.type_delete_get = asyncHandler(async (req, res, next) => {
  // Obtenga detalles del tipo y todas sus plantas (en paralelo)
  const [type, allPlantsByType] = await Promise.all([
    Type.findById(req.params.id).exec(),
    Plant.find({ type: req.params.id }, "name price").exec(),
  ]);

  if (type === null) {
    // No results.
    res.redirect("/catalog/types");
  }

  res.render("type_delete", {
    title: "Borrar tipo",
    type: type,
    type_plants: allPlantsByType,
  });
});

// Manejar Type delete en POST.
exports.type_delete_post = asyncHandler(async (req, res, next) => {
  // Obtenga detalles del tipo y todas sus plantas (en paralelo)
  const [type, allPlantsByType] = await Promise.all([
    Type.findById(req.params.id).exec(),
    Plant.find({ type: req.params.id }, "name price").exec(),
  ]);

  if (allPlantsByType.length > 0) {
    // El tipo tiene plantas. Renderizar de la misma manera que para obtener la ruta.
    res.render("type_delete", {
      title: "Borrar tipo",
      type: type,
      type_plants: allPlantsByType,
    });
    return;
  } else {
    // El tipo no tiene plantas. Eliminar el objeto y redirigir a la lista de tipos.
    await Type.findByIdAndRemove(req.body.typeid);
    res.redirect("/catalog/types");
  }
});

// Mostrar Type update form en GET.
exports.type_update_get = asyncHandler(async (req, res, next) => {
  const type = await Type.findById(req.params.id).exec();

  if (type === null) {
    // No results.
    const err = new Error("Tipo no encontrado");
    err.status = 404;
    return next(err);
  }

  res.render("type_form", { title: "Actualizar tipo", type: type });
});

// Manejar Type update en POST.
exports.type_update_post = [
  // Validar y sanear el campo Nombre.
  body("name", "El tipo debe contener al menos 3 caracteres")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Solicitud de proceso después de la validación y desinfección.
  asyncHandler(async (req, res, next) => {
    // Extraiga los errores de validación de una solicitud.
    const errors = validationResult(req);

    // Cree un objeto tipo con datos escapados y recortados (y la ID antigua)
    const type = new Type({
      name: req.body.name,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // Hay errores. Renderiza el formulario nuevamente con valores saneados y mensajes de error.
      res.render("type_form", {
        title: "Actualizar tipo",
        type: type,
        errors: errors.array(),
      });
      return;
    } else {
      // Los datos del formulario son válidos. Actualizar el registro.
      await Type.findByIdAndUpdate(req.params.id, type);
      res.redirect(type.url);
    }
  }),
];
