"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Store_staff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //1 role co nhieu user
      Store_staff.belongsTo(models.Store, {
        foreignKey: "store_id",
        as: "StoreStaffWorkDate",
        targetKey: "id",
      });
      Store_staff.belongsTo(models.Staff, {
        foreignKey: "store_id",
        as: "StaffStoreWorkDate",
        targetKey: "id",
      });
    }
  }
  Store_staff.init(
    {
      sta_id: DataTypes.INTEGER,
      store_id: DataTypes.INTEGER,
      starttime: DataTypes.DATE,
      endtime: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Store_staff",
      freezeTableName: true,
    }
  );
  return Store_staff;
};
