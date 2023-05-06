const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PlantInstanceSchema = new Schema({
  plant: { type: Schema.Types.ObjectId, ref: "Plant", required: true }, // referencia a la planta asociada
  imprint: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["Disponible", "Mantenimiento", "Reservada"],
    default: "Mantenimiento",
  },
});

// Virtual para el URL de PlantaInstance
PlantInstanceSchema.virtual("url").get(function () {
  return `/catalog/plantinstance/${this._id}`;
});

// Export model
const PlantInstance = mongoose.model("PlantInstance", PlantInstanceSchema);
module.exports = { PlantInstance };
