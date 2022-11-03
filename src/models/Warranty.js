"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Warranty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //1 role co nhieu user
      Warranty.belongsTo(models.Store, {
        foreignKey: "store_id",
        as: "StoreWarranty",
        targetKey: "id",
      });
      Warranty.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "ProductWarranty",
        targetKey: "id",
      });
      Warranty.belongsTo(models.User, {
        foreignKeys: "user_id",
        as: "UserWarranty",
        targetKey: "id",
      });
    }
  }
  Warranty.init(
    {
      infor: DataTypes.STRING,
      description: DataTypes.STRING,
      store_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Warranty",
      freezeTableName: true,
    }
  );
  return Warranty;
};
