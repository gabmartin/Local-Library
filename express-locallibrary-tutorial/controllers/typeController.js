const { Type } = require("../models/type");
const asyncHandler = require('express-async-handler')

// Display list of all type.
exports.type_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: type list");
});

// Display detail page for a specific type.
exports.type_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: type detail: ${req.params.id}`);
});

// Display type create form on GET.
exports.type_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: type create GET");
});

// Handle type create on POST.
exports.type_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: type create POST");
});

// Display type delete form on GET.
exports.type_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: type delete GET");
});

// Handle type delete on POST.
exports.type_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: type delete POST");
});

// Display type update form on GET.
exports.type_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: type update GET");
});

// Handle type update on POST.
exports.type_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: type update POST");
});
