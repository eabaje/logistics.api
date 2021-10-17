module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('Users', {
    UserId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
    },
    CompanyId: { type: DataTypes.INTEGER },
    FirstName: { type: DataTypes.STRING },
    LastName: { type: DataTypes.STRING },
    FullName: { type: DataTypes.STRING },
    Email: { type: DataTypes.STRING },
    Phone: { type: DataTypes.STRING },
    Address: { type: DataTypes.STRING },
    City: { type: DataTypes.STRING },
    Country: { type: DataTypes.STRING },
    UserName: { type: DataTypes.STRING },
    Password: { type: DataTypes.STRING },
    UserPicUrl: { type: DataTypes.STRING },
    Token: { type: DataTypes.STRING },
    IsActivated: { type: DataTypes.BOOLEAN },

    LoginType: { type: DataTypes.STRING },
  });

  return User;
};
