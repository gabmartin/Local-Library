const { Plant } = require("../models/plant");
const asyncHandler = require('express-async-handler')

exports.index = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Site Home Page");
});

// Display list of all plants.
exports.plant_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Plant list");
});

// Display detail page for a specific plant.
exports.plant_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Plant detail: ${req.params.id}`);
});

// Display plant create form on GET.
exports.plant_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Plant create GET");
});

// Handle plant create on POST.
exports.plant_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Plant create POST");
});

// Display plant delete form on GET.
exports.plant_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Plant delete GET");
});

// Handle plant delete on POST.
exports.plant_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Plant delete POST");
});

// Display plant update form on GET.
exports.plant_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Plant update GET");
});

// Handle plant update on POST.
exports.plant_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Plant update POST");
});
