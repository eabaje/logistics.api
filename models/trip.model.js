module.exports = (sequelize, DataTypes) => {
  const Trip = sequelize.define('Trips', {
    TripId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
    },
    TrackId: { type: DataTypes.STRING },
    ShipmentId: { type: DataTypes.STRING },
    VehicleId: { type: DataTypes.STRING },
    DriverId: { type: DataTypes.STRING },
    PickUpLocation: { type: DataTypes.STRING },
    DeliveryLocation: { type: DataTypes.STRING },
    PickUpDate: { type: DataTypes.DATE },
    Duration: { type: DataTypes.STRING },
    DeliveryDate: { type: DataTypes.DATE },
    DriverNote: { type: DataTypes.STRING },
    Rating: { type: DataTypes.INTEGER },
  });

  return Trip;
};
