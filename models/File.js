const { model, Schema } = require("mongoose");

const fileSchema = new Schema({
  filename: String,
  mimetype: String,
  encoding: String,
});

module.exports = model("File", fileSchema);
