module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Roles', {
    RoleId: {
      type: DataTypes.UUID,
      primaryKey: true,
      // defaultValue: DataTypes.UUIDV1,
    },
    Name: {
      type: DataTypes.STRING,
    },
  });

  return Role;
};
