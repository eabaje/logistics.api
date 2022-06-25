module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('Subscriptions', {
    SubscribeId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    SubscriptionType: { type: DataTypes.STRING },
    SubscriptionName: { type: DataTypes.STRING },
    Amount: { type: DataTypes.DECIMAL },

    Description: { type: DataTypes.STRING },
    Active: { type: DataTypes.BOOLEAN },
    Duration: { type: DataTypes.INTEGER },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }
  });

  return Subscription;
};
