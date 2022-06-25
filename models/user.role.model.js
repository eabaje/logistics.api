module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('UserRoles', {
    UserRoleId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
    },
    UserId: { type: DataTypes.STRING },
    RoleId: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }
  });

  return UserRole;
};
