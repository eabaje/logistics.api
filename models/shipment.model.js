// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   CompanyId: { type: Number },
//   LoadCategory: { type: String, default: null },
//   LoadType: { type: String},
//   LoadWeight: { type: Decimal },
//   Description: { type: String },
//   Phone: { type: String },
//   Email: { type: String },
//   PicUrl: { type: String },
//   LicenseUrl: { type: String },
//   Licensed: { type: Boolean },

// });

// module.exports = mongoose.model("Shipment", userSchema);

module.exports = (sequelize, DataTypes) => {
  const Shipment = sequelize.define('Shipments', {
    ShipmentId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
    },
    UserId: { type: DataTypes.STRING },
    CompanyId: { type: DataTypes.INTEGER },
    LoadCategory: { type: DataTypes.STRING },
    LoadType: { type: DataTypes.STRING },
    LoadWeight: { type: DataTypes.DECIMAL(10, 2) },
    LoadUnit: { type: DataTypes.STRING },
    Qty: { type: DataTypes.INTEGER },
    Description: { type: DataTypes.STRING },
    PickUpLocation: { type: DataTypes.STRING },
    DeliveryLocation: { type: DataTypes.STRING },
    ExpectedPickUpDate: { type: DataTypes.DATE },
    ExpectedDeliveryDate: { type: DataTypes.DATE },
    RequestForShipment: { type: DataTypes.STRING },
    AssignedShipment: { type: DataTypes.BOOLEAN },
    ShipmentDate: { type: DataTypes.DATE },
    ShipmentDocs: { type: DataTypes.STRING },
    ShipmentStatus: { type: DataTypes.STRING },
  });

  return Shipment;
};
