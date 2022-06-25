module.exports = (sequelize, DataTypes) => {
  const SiteContent = sequelize.define('SiteContents', {
    ContentId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    ContentType: { type: DataTypes.STRING },
    Title: { type: DataTypes.STRING },
    Summary: { type: DataTypes.STRING },
    ContentDetail: { type: DataTypes.STRING },
    Active: { type: DataTypes.BOOLEAN },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }
  });

  return SiteContent;
};
