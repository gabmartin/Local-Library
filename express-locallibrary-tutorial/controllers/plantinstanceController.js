const { PlantInstance } = require("../models/plantinstance");
const asyncHandler = require('express-async-handler')

// Display list of all PlantInstances.
exports.plantinstance_list = asyncHandler(async (req, res, next) => {
  const allPlantInstances = await PlantInstance.find().populate("plant").exec();

  res.render("plantinstance_list", {
    title: "Plant Instance List",
    plantinstance_list: allPlantInstances,
  });
});


// Display detail page for a specific Plantinstance.
exports.plantinstance_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Plantinstance detail: ${req.params.id}`);
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
