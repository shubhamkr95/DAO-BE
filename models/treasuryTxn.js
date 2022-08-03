const mongoose = require("mongoose");

const treasurySchema = new mongoose.Schema({
 treasury_hash: {
  type: String,
  required: true,
 },
});

const treasuryData = mongoose.model("TREASURY", treasurySchema);
module.exports = { treasuryData };
