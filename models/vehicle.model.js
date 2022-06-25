// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   CarrierId: { type: Number },
//   VehicleType: { type: String, default: null },
//   VehicleNumber: { type: String},
//   SerialNumber: { type: String},
//   VehicleMake: { type: String },
//   VehicleColor: { type: String },
//   VehicleModel: { type: String },
//   LicensePlate: { type: String },
//   VehicleModelYear: { type: Date },
//   PurchaseYear: { type: Date },
//   Insured: { type: Boolean },
//   PicUrl: { type: String },
//   VehicleDocs: { type: String },

// });

// module.exports = mongoose.model("Vehicle", userSchema);

module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define('Vehicles', {
    VehicleId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
    },
    // CarrierId: { type: DataTypes.STRING },
    VehicleType: { type: DataTypes.STRING, default: null },
    VehicleNumber: { type: DataTypes.STRING },
    SerialNumber: { type: DataTypes.STRING },
    VehicleMake: { type: DataTypes.STRING },
    VehicleColor: { type: DataTypes.STRING },
    VehicleModel: { type: DataTypes.STRING },
    LicensePlate: { type: DataTypes.STRING },
    VehicleModelYear: { type: DataTypes.DATEONLY },
    PurchaseYear: { type: DataTypes.DATEONLY },
    Insured: { type: DataTypes.BOOLEAN },
    PicUrl: { type: DataTypes.STRING },
    Description: { type: DataTypes.STRING },

    VehicleDocs: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }
    // CarrierId: {
    //   type: DataTypes.STRING,
    //   references: {
    //     model: Carrier,
    //     key: 'CarrierId'
    //   }
    // },
  });

  return Vehicle;
};
