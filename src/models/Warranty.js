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

      Warranty.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "ProductWarranty",
        targetkey: "id",
      });
      Warranty.belongsTo(models.Store, {
        foreignKey: "store_id",
        as: "StoreWarranty",
        targetkey: "id",
      });
      Warranty.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "UserWarranty",
        targetkey: "id",
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
