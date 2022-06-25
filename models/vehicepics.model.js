const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  CarrierId: { type: Number },
  VehicleType: { type: String, default: null },
  VehicleNumber: { type: String},
  SerialNumber: { type: String},
  VehicleMake: { type: String },
  VehicleColor: { type: String },
  VehicleModel: { type: String },
  LicensePlate: { type: String },
  VehicleModelYear: { type: Date },
  PurchaseYear: { type: Date },
  Insured: { type: Boolean },
  PicUrl: { type: String },
  VehicleDocs: { type: String },
  createdAt: { type: DataTypes.DATE },
  updatedAt: { type: DataTypes.DATE }

 
 
});

module.exports = mongoose.model("VehiclePics", userSchema);