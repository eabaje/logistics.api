module.exports = (sequelize, DataTypes) => {
  const TrackShipment = sequelize.define('TrackShipments', {
    TrackShipmentId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
    },

    StartBy: { type: DataTypes.STRING },
    StartByRole: { type: DataTypes.STRING },
    StartAction: { type: DataTypes.STRING },
    StartActionDate: { type: DataTypes.DATE },
    EndBy: { type: DataTypes.STRING },
    EndByRole: { type: DataTypes.STRING },
    EndAction: { type: DataTypes.STRING },
    EndActionDate: { type: DataTypes.DATE },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },
  });

  return TrackShipment;
};
