module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Companys', {
    CompanyId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    CompanyName: { type: DataTypes.STRING },
    ContactEmail: { type: DataTypes.STRING },
    ContactPhone: { type: DataTypes.STRING },
    Address: { type: DataTypes.STRING },
    Country: { type: DataTypes.STRING },
    Region: { type: DataTypes.STRING },
    CompanyType: { type: DataTypes.STRING },
    Specilaization: { type: DataTypes.STRING },
    IsVetted: { type: DataTypes.BOOLEAN },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },
  });

  return Company;
};
