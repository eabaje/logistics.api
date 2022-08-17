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
    IsContractSigned: { type: DataTypes.BOOLEAN, default: false },
    IsContractConfirmed: { type: DataTypes.BOOLEAN, default: false },
    IsContractAccepted: { type: DataTypes.BOOLEAN, default: false },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },
  });

  return AssignShipment;
};
