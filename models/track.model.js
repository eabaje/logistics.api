module.exports = (sequelize, DataTypes) => {
  const Track = sequelize.define('Tracks', {
    TrackId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    TripId: { type: DataTypes.STRING },
    Status: { type: DataTypes.STRING },
    TrackNote: { type: DataTypes.STRING },
  });

  return Track;
};
