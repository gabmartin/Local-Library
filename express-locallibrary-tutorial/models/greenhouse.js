const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GreenhouseSchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
    location: { type: String, required: true, maxLength: 100 },
});

// Virtual para la url del invernadero
GreenhouseSchema.virtual("url").get(function () {
    return `/catalog/greenhouse/${this._id}`;
})

// Exportar modelo
const Greenhouse = mongoose.model("Greenhouse", GreenhouseSchema)
module.exports = { Greenhouse };