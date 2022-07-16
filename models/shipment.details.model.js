module.exports = (sequelize, DataTypes) => {
  const ShipmentDetail = sequelize.define('ShipmentDetails', {
    ShipmentDetailId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    ShipmentType: { type: DataTypes.STRING },
    LoadCategory: { type: DataTypes.STRING },
    LoadType: { type: DataTypes.STRING },
    LoadWeight: { type: DataTypes.DECIMAL },
    LoadUnit: { type: DataTypes.STRING },

    DeliveryPrice: { type: DataTypes.DOUBLE },

    VehicleType: { type: DataTypes.STRING, default: null },
    VIN: { type: DataTypes.STRING },
    VehicleMake: { type: DataTypes.STRING },
    VehicleColor: { type: DataTypes.STRING },
    VehicleModel: { type: DataTypes.STRING },
    Qty: { type: DataTypes.INTEGER },
    VehicleModelYear: { type: DataTypes.DATEONLY },
    PurchaseYear: { type: DataTypes.DATEONLY },

    Description: { type: DataTypes.STRING },

    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },
  });

  return ShipmentDetail;
};
