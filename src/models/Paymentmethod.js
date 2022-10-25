"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Paymentmethod extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //1 paymentmethod co nhieu order
      Paymentmethod.hasMany(models.Order, {
        foreignKey: "method_id",
        as: "MethodOrder",
      });
    }
  }
  Paymentmethod.init(
    {
      method: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Paymentmethod",
      freezeTableName: true,
    }
  );
  return Paymentmethod;
};
