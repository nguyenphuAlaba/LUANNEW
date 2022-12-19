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

      // Warranty.belongsTo(models.Product, {
      //   foreignKey: "product_id",
      //   as: "ProductWarranty",
      //   targetkey: "id",
      // });
      // Warranty.belongsTo(models.Orderitem, {
      //   foreignKey: "order_id",
      //   as: "OrderItemWarranty",
      //   targetKey: "id",
      // });
      Warranty.belongsTo(models.Order, {
        foreignKey: "order_id",
        as: "OrderWarranty",
        targetKey: "id",
      });
      Warranty.belongsTo(models.Store, {
        foreignKey: "store_id",
        as: "StoreWarranty",
        targetkey: "id",
      });
      Warranty.belongsTo(models.Customer, {
        foreignKey: "cus_id",
        as: "UserWarranty",
        targetkey: "id",
      });
      Warranty.hasMany(models.Warranty_info, {
        foreignKey: "warranty_id",
        as: "WarrantyInfor",
      });
      // Warranty.belongsTo(models.Staff, {
      //   foreignKey: "sta_id",
      //   as: "StaffWarranty",
      //   targetKey: "id",
      // });
    }
  }
  Warranty.init(
    {
      code: DataTypes.STRING,
      infor: DataTypes.STRING,
      description: DataTypes.STRING,
      store_id: DataTypes.INTEGER,
      // product_id: DataTypes.INTEGER,
      cus_id: DataTypes.INTEGER,
      // sta_id: DataTypes.INTEGER,
      expire: DataTypes.DATE,
      order_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Warranty",
      freezeTableName: true,
    }
  );
  return Warranty;
};
