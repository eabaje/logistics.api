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
    IsContractSigned: { type: DataTypes.BOOLEAN, default: false },
    AssignedTo: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },
  });

  return AssignShipment;
};
