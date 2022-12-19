"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //1 role co nhieu user
      Store.belongsToMany(models.Staff, {
        foreignKey: "store_id",
        through: models.Store_staff,
        as: "Storehavestaff",
      });
      Store.hasMany(models.Warranty_info, {
        foreignKey: "store_id",
        as: "StoreWarranty",
      });
    }
  }
  Store.init(
    {
      address: DataTypes.STRING,
      name: DataTypes.STRING,
      phone: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Store",
      freezeTableName: true,
    }
  );
  return Store;
};
