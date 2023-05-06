const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PlantSchema = new Schema({
  name: { type: String, required: true },
  greenhouse: { type: Schema.Types.ObjectId, ref: "Greenhouse", required: true },
  price: { type: Number, required: true },
  type: [{ type: Schema.Types.ObjectId, ref: "Type" }],
});

// Virtual para la url de la planta
PlantSchema.virtual("url").get(function () {
  return `/catalog/plant/${this._id}`;
});

// Exportar modelo
const Plant = mongoose.model("Plant", PlantSchema)
module.exports = { Plant };
