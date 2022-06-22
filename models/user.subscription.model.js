module.exports = (sequelize, DataTypes) => {
  const UserSubscription = sequelize.define('UserSubscription', {
    UserSubscriptionId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // SubscriptionId: { type: DataTypes.INTEGER },
    SubscriptionName: { type: DataTypes.STRING },
    // UserId: { type: DataTypes.STRING },
    Active: { type: DataTypes.BOOLEAN },
    StartDate: { type: DataTypes.DATEONLY },
    EndDate: { type: DataTypes.DATEONLY },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }

    // UserId: {
    //   type: DataTypes.STRING,
    //   references: {
    //     model: User,
    //     key: 'UserId'
    //   }
    // },

    // SubscriptionId: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: Subscription,
    //     key: 'SubscriptionId'
    //   }
    // },
  });

  return UserSubscription;
};
