const { body, validationResult } = require("express-validator");
const { Greenhouse } = require("../models/greenhouse");
const asyncHandler = require('express-async-handler');
const { Plant } = require("../models/plant");
const mongoose = require("mongoose");

// Display list of all Greenhouses.
exports.greenhouse_list = asyncHandler(async (req, res, next) => {
  const allGreenhouses = await Greenhouse.find().sort({ name: 1 }).exec();
  res.render("greenhouse_list", {
    title: "Lista de invernaderos",
    greenhouse_list: allGreenhouses,
  });
});


// Display detail page for a specific Greenhouse.
exports.greenhouse_detail = asyncHandler(async (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  // Get details of greenhouse and all their plants (in parallel)
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

// Display Greenhouse create form on GET.
exports.greenhouse_create_get = (req, res, next) => {
  res.render("greenhouse_form", { title: "Crear invernadero" });
};

// Handle Greenhouse create on POST.
exports.greenhouse_create_post = [
  // Validate and sanitize fields.
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

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Greenhouse object with escaped and trimmed data
    const greenhouse = new Greenhouse({
      name: req.body.name,
      location: req.body.location,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("greenhouse_form", {
        title: "Crear invernadero",
        greenhouse: greenhouse,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.

      // Save greenhouse.
      await greenhouse.save();
      // Redirect to new greenhouse record.
      res.redirect(greenhouse.url);
    }
  }),
];

// Display Greenhouse delete form on GET.
exports.greenhouse_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of greenhouse and all their plants (in parallel)
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


// Handle Greenhouse delete on POST.
exports.greenhouse_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of greenhouse and all their plants (in parallel)
  const [greenhouse, allPlantsByGreenhouse] = await Promise.all([
    Greenhouse.findById(req.params.id).exec(),
    Plant.find({ greenhouse: req.params.id }, "name price").exec(),
  ]);

  if (allPlantsByGreenhouse.length > 0) {
    // Greenhouse has plants. Render in same way as for GET route.
    res.render("greenhouse_delete", {
      title: "Lista de invernaderos",
      greenhouse: greenhouse,
      greenhouse_plants: allPlantsByGreenhouse,
    });
    return;
  } else {
    // Greenhouse has no plants. Delete object and redirect to the list of greenhouses.
    await Greenhouse.findByIdAndRemove(req.body.greenhouseid);
    res.redirect("/catalog/greenhouses");
  }
});


// Display Greenhouse update form on GET.
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

// Handle Greenhouse update on POST.
exports.greenhouse_update_post = [
  // Validate and sanitize fields.
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

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Greenhouse object with escaped and trimmed data (and the old id!)
    const greenhouse = new Greenhouse({
      name: req.body.name,
      location: req.body.location,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values and error messages.
      res.render("greenhouse_form", {
        title: "Actualizar invernadero",
        greenhouse: greenhouse,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      await Greenhouse.findByIdAndUpdate(req.params.id, greenhouse);
      res.redirect(greenhouse.url);
    }
  }),
];
