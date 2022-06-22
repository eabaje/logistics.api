module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('Users', {
    UserId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
    },
    // CompanyId: { type: DataTypes.INTEGER },
    FirstName: { type: DataTypes.STRING },
    LastName: { type: DataTypes.STRING },
    FullName: { type: DataTypes.STRING },
    Email: { type: DataTypes.STRING },
    Phone: { type: DataTypes.STRING },
    Address: { type: DataTypes.STRING },
    City: { type: DataTypes.STRING },
    Region: { type: DataTypes.STRING },
    Country: { type: DataTypes.STRING },
    UserName: { type: DataTypes.STRING },
    Password: { type: DataTypes.STRING },
    UserPicUrl: { type: DataTypes.STRING },
    Token: { type: DataTypes.STRING },
    IsConfirmed: { type: DataTypes.BOOLEAN },
    IsActivated: { type: DataTypes.BOOLEAN },
    AcceptTerms: { type: DataTypes.BOOLEAN },
    LoginCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    PaymentMethod: { type: DataTypes.STRING },
    Currency: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }

    // CompanyId: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: Company,
    //     key: 'CompanyId'
    //   }
    // },
  });

  return User;
};
