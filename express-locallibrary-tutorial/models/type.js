const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TypeSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 100
  },
});

// Virtual para el URL de PlantaInstance
TypeSchema.virtual("url").get(function () {
  return `/catalog/type/${this._id}`;
});

// Exportar modelo

const Type = mongoose.model("Type", TypeSchema);
module.exports = { Type };
