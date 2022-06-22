module.exports = (sequelize, DataTypes) => {
  const Insurance = sequelize.define('Insurances', {
    InsuranceId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ShipmentId: { type: DataTypes.STRING },
    CompanyId: { type: DataTypes.INTEGER },
    InsuranceName: { type: DataTypes.STRING },
    InsuranceType: { type: DataTypes.STRING },
    Insurer: { type: DataTypes.STRING },
    Address: { type: DataTypes.STRING },
    InsureranceDoc: { type: DataTypes.STRING },
    Rating: { type: DataTypes.INTEGER },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }
  });

  return Insurance;
};
