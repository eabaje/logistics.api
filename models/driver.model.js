module.exports = (sequelize, DataTypes) => {
  const Driver = sequelize.define('Drivers', {
    DriverId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
    },
    //  CompanyId: { type: DataTypes.INTEGER },
    DriverName: { type: DataTypes.STRING },
    Email: { type: DataTypes.STRING },
    Phone: { type: DataTypes.STRING },
    SecondaryPhone: { type: DataTypes.STRING },
    DOB: { type: DataTypes.DATEONLY },
    Address: { type: DataTypes.STRING },
    City: { type: DataTypes.STRING },
    Region: { type: DataTypes.STRING },
    Country: { type: DataTypes.STRING },
    PicUrl: { type: DataTypes.STRING },
    Licensed: { type: DataTypes.BOOLEAN },
    LicenseNo: { type: DataTypes.STRING },
    LicenseUrl: { type: DataTypes.STRING },
    Rating: { type: DataTypes.INTEGER },
    DriverDocs: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },

    // CompanyId: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: Company,
    //     key: 'CompanyId'
    //   }
    // },
  });
  // Driver.associate = (models) => {
  //   Driver.belongsTo(models.Company, {
  //     foriegnKey: {},
  //   });
  // };
  return Driver;
};
