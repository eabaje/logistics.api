module.exports = (sequelize, DataTypes) => {
    const Verifcation = sequelize.define("Verifications", {
        Id: {
            type: DataTypes.INTEGER,autoIncrement:true,primaryKey: true 
          },
          UserId: { type: DataTypes.INTEGER },
          Token: { type: DataTypes.STRING }
          
          
         
    });
  
    return Verifcation;
  };
  