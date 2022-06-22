module.exports = (sequelize, DataTypes) => {
  const AssignDriver = sequelize.define('AssignDrivers', {
    AssignId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
    },
    // VehicleId: { type: DataTypes.STRING },
    // DriverId: { type: DataTypes.STRING, default: null },
    Assigned: { type: DataTypes.BOOLEAN },

    AssignedDate: { type: DataTypes.DATE },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }


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

  return AssignDriver;
};
