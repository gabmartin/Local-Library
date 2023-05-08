const { Greenhouse } = require("../models/greenhouse");
const asyncHandler = require('express-async-handler')


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
  res.send(`NOT IMPLEMENTED: Greenhouse detail: ${req.params.id}`);
});

// Display Greenhouse create form on GET.
exports.greenhouse_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Greenhouse create GET");
});

// Handle Greenhouse create on POST.
exports.greenhouse_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Greenhouse create POST");
});

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
