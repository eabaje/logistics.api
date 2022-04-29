module.exports = (sequelize, DataTypes) => {
    const CompanyDoc = sequelize.define('CompanyDocs', {
      DocId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      RefId: { type: DataTypes.STRING },
      DocName: { type: DataTypes.STRING },
      DocType: { type: DataTypes.STRING },
      DocUrl: { type: DataTypes.STRING },
      
    });
  
    return CompanyDoc;
  };
  