module.exports = (sequelize, DataTypes) => {
    const Media = sequelize.define('Medias', {
      MediaId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      RefId: { type: DataTypes.STRING },
      url: { type: DataTypes.STRING },
      UploadDate: { type: DataTypes.DATEONLY },
    
    });
  
    return Media;
  };
  