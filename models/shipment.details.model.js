module.exports = (sequelize, DataTypes) => {
    const ShipmentDetail = sequelize.define("ShipmentDetails", {
      ShipmentDetailId: {
        type: DataTypes.Integer,autoIncrement:true,primaryKey: true 
      },
      ShipmentId: { type: DataTypes.STRING },
      LoadCategory: { type: DataTypes.STRING },
      LoadType: { type: DataTypes.STRING },
      LoadWeight: { type: DataTypes.DECIMAL },
      LoadUnit: { type: DataTypes.STRING },
      Description: { type: DataTypes.STRING },
      PickUpLocation: { type: DataTypes.STRING },
      DeliveryLocation: { type: DataTypes.STRING },
      PickUpDate: { type: DataTypes.DATE },
      DeliveryDate: { type: DataTypes.DATE },
      ShipmentDate: { type: DataTypes.DATE },
      Licensed: { type: DataTypes.BOOLEAN },
      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE }
    });
  
    return ShipmentDetail;
  };
  