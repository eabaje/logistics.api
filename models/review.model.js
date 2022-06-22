module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('Reviews', {
      ReviewId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
  
      UserId: { type: DataTypes.STRING },
      Name: { type: DataTypes.STRING },
      Comment: { type: DataTypes.STRING },
      Rating: { type: DataTypes.STRING },
      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE }
      
    });
  
    return Review;
  };
  