module.exports = (sequelize, DataTypes) => {
    const Verifcation = sequelize.define("Verifications", {
        Id: {
            type: DataTypes.INTEGER,autoIncrement:true,primaryKey: true 
          },
          UserId: { type: DataTypes.INTEGER },
          Token: { type: DataTypes.STRING },
          createdAt: { type: DataTypes.DATE },
          updatedAt: { type: DataTypes.DATE }
          
         
    });
  
    return Verifcation;
  };
  