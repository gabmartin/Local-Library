const { PlantInstance } = require("../models/plantinstance");
const asyncHandler = require('express-async-handler');
const mongoose = require("mongoose");

// Display list of all PlantInstances.
exports.plantinstance_list = asyncHandler(async (req, res, next) => {
  const allPlantInstances = await PlantInstance.find().populate("plant").exec();

  res.render("plantinstance_list", {
    title: "Plant Instance List",
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
    const err = new Error("Plant copy not found");
    err.status = 404;
    return next(err);
  }

  res.render("plantinstance_detail", {
    title: "Plant:",
    plantinstance: plantInstance,
  });
});


// Display Plantinstance create form on GET.
exports.plantinstance_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Plantinstance create GET");
});

// Handle Plantinstance create on POST.
exports.plantinstance_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Plantinstance create POST");
});

// Display Plantinstance delete form on GET.
exports.plantinstance_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Plantinstance delete GET");
});

// Handle Plantinstance delete on POST.
exports.plantinstance_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Plantinstance delete POST");
});

// Display Plantinstance update form on GET.
exports.plantinstance_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Plantinstance update GET");
});

// Handle plantinstance update on POST.
exports.plantinstance_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Plantinstance update POST");
});
