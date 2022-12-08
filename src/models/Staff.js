"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //1 role co nhieu user
      Staff.belongsTo(models.Role, {
        foreignKey: "role_id",
        as: "UserRole",
        targetKey: "id",
      });
      Staff.hasMany(models.Blog, {
        foreignKey: "sta_id",
        as: "UserBlog",
      });
      Staff.belongsToMany(models.Warehouse, {
        foreignKey: "sta_id",
        as: "StaffInWarehouse",
        through: models.Warehouse_staff,
      });
      Staff.belongsToMany(models.Store, {
        foreignKey: "store_id",
        through: models.Store_staff,
        as: "StaffInStore",
      });
      Staff.hasMany(models.Warranty, {
        foreignKey: "sta_id",
        as: "StaffWarranty",
      });
    }
  }
  Staff.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      fullname: DataTypes.STRING,
      phonenumber: DataTypes.STRING,
      avatar: DataTypes.STRING,
      role_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Staff",
      freezeTableName: true,
    }
  );
  return Staff;
};
