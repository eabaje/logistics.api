module.exports = (sequelize, DataTypes) => {
  const UserSubscription = sequelize.define('UserSubscription', {
    UserSubscriptionId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    SubscriptionId: { type: DataTypes.INTEGER },
    SubscriptionName: { type: DataTypes.STRING },
    UserId: { type: DataTypes.STRING },
    Active: { type: DataTypes.BOOLEAN },
    StartDate: { type: DataTypes.DATE },
    EndDate: { type: DataTypes.DATE },
  });

  return UserSubscription;
};
