const { body, validationResult } = require("express-validator");
const { Greenhouse } = require("../models/greenhouse");
const asyncHandler = require('express-async-handler');
const { Plant } = require("../models/plant");
const mongoose = require("mongoose");

// Display list of all Greenhouses.
exports.greenhouse_list = asyncHandler(async (req, res, next) => {
  const allGreenhouses = await Greenhouse.find().sort({ name: 1 }).exec();
  res.render("greenhouse_list", {
    title: "Greenhouse List",
    greenhouse_list: allGreenhouses,
  });
});


// Display detail page for a specific Greenhouse.
exports.greenhouse_detail = asyncHandler(async (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  // Get details of greenhouse and all their books (in parallel)
  const [greenhouse, allPlantsByGreenhouse] = await Promise.all([
    Greenhouse.findById(id).exec(),
    Plant.find({ greenhouse: id }, "name price").exec(),
  ]);

  if (greenhouse === null) {
    // No results.
    const err = new Error("Greenhouse not found");
    err.status = 404;
    return next(err);
  }

  res.render("greenhouse_detail", {
    title: "Greenhouse Detail",
    greenhouse: greenhouse,
    greenhouse_plants: allPlantsByGreenhouse,
  });
});

// Display Greenhouse create form on GET.
exports.greenhouse_create_get = (req, res, next) => {
  res.render("greenhouse_form", { title: "Create Greenhouse" });
};

// Handle Greenhouse create on POST.
exports.greenhouse_create_post = [
  // Validate and sanitize fields.
  body("name")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("Name must be specified."),
    body("location")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("Location must be specified."),

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
        title: "Create Greenhouse",
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
  res.send("NOT IMPLEMENTED: Greenhouse delete GET");
});

// Handle Greenhouse delete on POST.
exports.greenhouse_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Greenhouse delete POST");
});

// Display Greenhouse update form on GET.
exports.greenhouse_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Greenhouse update GET");
});

// Handle Greenhouse update on POST.
exports.greenhouse_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Greenhouse update POST");
});
