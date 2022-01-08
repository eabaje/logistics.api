module.exports = (sequelize, DataTypes) => {
  const AssignShipment = sequelize.define('AssignShipments', {
    AssignShipmentId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
    },
    // VehicleId: { type: DataTypes.STRING },
    // DriverId: { type: DataTypes.STRING, default: null },
    IsAssigned: { type: DataTypes.BOOLEAN },

    AssignedDate: { type: DataTypes.DATE },

    AssignedTo: { type: DataTypes.STRING },

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

  return AssignShipment;
};
