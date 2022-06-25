module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payments', {
    PaymentId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

   // OrderId: { type: DataTypes.STRING },
    TotalPrice: { type: DataTypes.DECIMAL },
    PaymentSessionId: { type: DataTypes.STRING },
    ReferenceId: { type: DataTypes.STRING },
    OrderStatus: { type: DataTypes.STRING },
    PaymentMethod: { type: DataTypes.STRING },
    PaymentDate: { type: DataTypes.DATEONLY },
    Currency: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }
  });

  return Payment;
};
