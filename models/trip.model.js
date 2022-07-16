module.exports = (sequelize, DataTypes) => {
  const Trip = sequelize.define('Trips', {
    TripId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
    },

    // ShipmentId: { type: DataTypes.STRING },
    // VehicleId: { type: DataTypes.STRING },
    // DriverId: { type: DataTypes.STRING },
    PickUpLocation: { type: DataTypes.STRING },
    DeliveryLocation: { type: DataTypes.STRING },

    PickUpDate: { type: DataTypes.DATEONLY },
    Duration: { type: DataTypes.STRING },
    DeliveryDate: { type: DataTypes.DATEONLY },

    Mileage: { type: DataTypes.DECIMAL },
    TripUnit: { type: DataTypes.STRING },

    TripCost: { type: DataTypes.DOUBLE },

    DriverNote: { type: DataTypes.STRING },
    Rating: { type: DataTypes.INTEGER },
    Review: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },

    // ShipmentId: {
    //   type: DataTypes.STRING,
    //   references: {
    //     model: Shipment,
    //     key: 'ShipmentId'
    //   }
    // },

    // VehicleId: {
    //   type: DataTypes.STRING,
    //   references: {
    //     model: Vehicle,
    //     key: 'VehicleId'
    //   }
    // },

    // DriverId: {
    //   type: DataTypes.STRING,
    //   references: {
    //     model: Driver,
    //     key: 'DriverId'
    //   }
    // },
  });

  return Trip;
};
