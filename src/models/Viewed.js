"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Viewed extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //mot viewed co nhieu product

      Viewed.belongsTo(models.Product, {
        foreignKey: "product_id",
        targetKey: "id",
        as: "ViewProduct",
      });

  
      //mot viewed chi thuoc 1 user
      Viewed.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: 'id',
        as: "UserView",
      });


    }
  }
  Viewed.init(
    {
      user_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Viewed",
      freezeTableName: true,
    }
  );
  return Viewed;
};
