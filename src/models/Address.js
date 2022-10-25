"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //1 address co the thuoc nhieu user
      Address.belongsTo(models.User, {
        foreignKey: "user_id",
        targetkey: "id",
        as: "UserAddress",
      });
    }
  }
  Address.init(
    {
      ward: DataTypes.INTEGER,
      district: DataTypes.INTEGER,
      street: DataTypes.STRING,
      city: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      addressdefault: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Address",
      freezeTableName: true,
    }
  );
  return Address;
};
