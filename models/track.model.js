module.exports = (sequelize, DataTypes) => {
  const Track = sequelize.define('Tracks', {
    TrackId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // TripId: { type: DataTypes.STRING },
    Status: { type: DataTypes.STRING },
    TrackNote: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }

    // TripId: {
    //   type: DataTypes.STRING,
    //   references: {
    //     model: Trip,
    //     key: 'TripId'
    //   }
    // },
  });

  return Track;
};
