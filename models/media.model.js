module.exports = (sequelize, DataTypes) => {
  const Media = sequelize.define('Medias', {
    MediaId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    RefId: { type: DataTypes.STRING },
    FileType: { type: DataTypes.STRING },
    FileName: { type: DataTypes.STRING },
    url: { type: DataTypes.STRING },
    ThumbUrl: { type: DataTypes.STRING },
    UploadDate: { type: DataTypes.DATEONLY },
  });

  return Media;
};
