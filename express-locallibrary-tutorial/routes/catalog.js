const express = require("express");
const router = express.Router();

// Require controller modules.
const plant_controller = require("../controllers/plantController");
const greenhouse_controller = require("../controllers/greenhouseController");
const type_controller = require("../controllers/typeController");
const plant_instance_controller = require("../controllers/plantinstanceController");

/// PLANT ROUTES ///

// GET catalog home page.
router.get("/", plant_controller.index);

// GET request for creating a Plant. NOTE This must come before routes that display Plant (uses id).
router.get("/plant/create", plant_controller.plant_create_get);

// POST request for creating Plant.
router.post("/plant/create", plant_controller.plant_create_post);

// GET request to delete Plant.
router.get("/plant/:id/delete", plant_controller.plant_delete_get);

// POST request to delete Plant.
router.post("/plant/:id/delete", plant_controller.plant_delete_post);

// GET request to update Plant.
router.get("/plant/:id/update", plant_controller.plant_update_get);

// POST request to update Plant.
router.post("/plant/:id/update", plant_controller.plant_update_post);

// GET request for one Plant.
router.get("/plant/:id", plant_controller.plant_detail);

// GET request for list of all Plant items.
router.get("/plants", plant_controller.plant_list);

/// GREENHOUSE ROUTES ///

// GET request for creating Greenhouse. NOTE This must come before route for id (i.e. display greenhouse).
router.get("/greenhouse/create", greenhouse_controller.greenhouse_create_get);

// POST request for creating Greenhouse.
router.post("/greenhouse/create", greenhouse_controller.greenhouse_create_post);

// GET request to delete Greenhouse.
router.get("/greenhouse/:id/delete", greenhouse_controller.greenhouse_delete_get);

// POST request to delete Greenhouse.
router.post("/greenhouse/:id/delete", greenhouse_controller.greenhouse_delete_post);

// GET request to update Greenhouse.
router.get("/greenhouse/:id/update", greenhouse_controller.greenhouse_update_get);

// POST request to update Greenhouse.
router.post("/greenhouse/:id/update", greenhouse_controller.greenhouse_update_post);

// GET request for one Greenhouse.
router.get("/greenhouse/:id", greenhouse_controller.greenhouse_detail);

// GET request for list of all Greenhouses.
router.get("/greenhouses", greenhouse_controller.greenhouse_list);

/// TYPE ROUTES ///

// GET request for creating a Type. NOTE This must come before route that displays Type (uses id).
router.get("/type/create", type_controller.type_create_get);

//POST request for creating Type.
router.post("/type/create", type_controller.type_create_post);

// GET request to delete Type.
router.get("/type/:id/delete", type_controller.type_delete_get);

// POST request to delete Type.
router.post("/type/:id/delete", type_controller.type_delete_post);

// GET request to update Type.
router.get("/type/:id/update", type_controller.type_update_get);

// POST request to update Type.
router.post("/type/:id/update", type_controller.type_update_post);

// GET request for one Type.
router.get("/type/:id", type_controller.type_detail);

// GET request for list of all Type.
router.get("/types", type_controller.type_list);

/// PLANTINSTANCE ROUTES ///

// GET request for creating a PlantInstance. NOTE This must come before route that displays PlantInstance (uses id).
router.get(
  "/plantinstance/create",
  plant_instance_controller.plantinstance_create_get
);

// POST request for creating PlantInstance.
router.post(
  "/plantinstance/create",
  plant_instance_controller.plantinstance_create_post
);

// GET request to delete PlantInstance.
router.get(
  "/plantinstance/:id/delete",
  plant_instance_controller.plantinstance_delete_get
);

// POST request to delete PlantInstance.
router.post(
  "/plantinstance/:id/delete",
  plant_instance_controller.plantinstance_delete_post
);

// GET request to update PlantInstance.
router.get(
  "/plantinstance/:id/update",
  plant_instance_controller.plantinstance_update_get
);

// POST request to update PlantInstance.
router.post(
  "/plantinstance/:id/update",
  plant_instance_controller.plantinstance_update_post
);

// GET request for one PlantInstance.
router.get("/plantinstance/:id", plant_instance_controller.plantinstance_detail);

// GET request for list of all PlantInstance.
router.get("/plantinstances", plant_instance_controller.plantinstance_list);

module.exports = router;
