const { body, validationResult } = require("express-validator");
const { Type } = require("../models/type");
const asyncHandler = require("express-async-handler");
const { Plant } = require("../models/plant");
const mongoose = require("mongoose");

// Display list of all Types.
exports.type_list = asyncHandler(async (req, res, next) => {
  const allTypes = await Type.find().sort({ name: 1 }).exec();
  res.render("type_list", {
    title: "Lista de tipos",
    type_list: allTypes,
  });
});

// Display detail page for a specific Type.
exports.type_detail = asyncHandler(async (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  // Get details of type and all associated plants (in parallel)
  const [type, plantsInType] = await Promise.all([
    Type.findById(id).exec(),
    Plant.find({ type: id }, "name price").populate("plant").exec(),
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

// Display Type create form on GET.
exports.type_create_get = (req, res, next) => {
  res.render("type_form", { title: "Crear tipo" });
};

// Handle Type create on POST.
exports.type_create_post = [
  // Validate and sanitize the name field.
  body("name", "El tipo debe contener al menos 3 caracteres")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a type object with escaped and trimmed data.
    const type = new Type({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("type_form", {
        title: "Crear tipo",
        type: type,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Type with same name already exists.
      const typeExists = await Type.findOne({ name: req.body.name }).exec();
      if (typeExists) {
        // Type exists, redirect to its detail page.
        res.redirect(typeExists.url);
      } else {
        await type.save();
        // New type saved. Redirect to type detail page.
        res.redirect(type.url);
      }
    }
  }),
];

// Display Type delete form on GET.
exports.type_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of type and all their plants (in parallel)
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

// Handle Author delete on POST.
exports.type_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of type and all their plants (in parallel)
  const [type, allPlantsByType] = await Promise.all([
    Type.findById(req.params.id).exec(),
    Plant.find({ type: req.params.id }, "name price").exec(),
  ]);

  if (allPlantsByType.length > 0) {
    // Type has plants. Render in same way as for GET route.
    res.render("type_delete", {
      title: "Borrar tipo",
      type: type,
      type_plants: allPlantsByType,
    });
    return;
  } else {
    // Type has no plants. Delete object and redirect to the list of types.
    await Type.findByIdAndRemove(req.body.typeid);
    res.redirect("/catalog/types");
  }
});

// Display Type update form on GET.
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

// Handle Type update on POST.
exports.type_update_post = [
  // Validate and sanitize the name field.
  body("name", "El tipo debe contener al menos 3 caracteres")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request .
    const errors = validationResult(req);

    // Create a type object with escaped and trimmed data (and the old id!)
    const type = new Type({
      name: req.body.name,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values and error messages.
      res.render("type_form", {
        title: "Actualizar tipo",
        type: type,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      await Type.findByIdAndUpdate(req.params.id, type);
      res.redirect(type.url);
    }
  }),
];
