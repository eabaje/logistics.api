module.exports = (sequelize, DataTypes) => {
  const ShipmentInterested = sequelize.define('ShipmentsInterested', {
    ShipmentInterestId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
    },
    // ShipmentId: { type: DataTypes.STRING },
    CarrierId: { type: DataTypes.STRING, default: null },
    IsInterested: { type: DataTypes.BOOLEAN },
    InterestDate: { type: DataTypes.DATEONLY },

    // DriverId: {
    //   type: DataTypes.STRING,
    //   references: {
    //     model: Driver,
    //     key: 'DriverId'
    //   }
    // },

    // ShipmentId: {
    //   type: DataTypes.STRING,
    //   references: {
    //     model: Shipment,
    //     key: 'ShipmentId'
    //   }
    // },
  });

  return ShipmentInterested;
};
