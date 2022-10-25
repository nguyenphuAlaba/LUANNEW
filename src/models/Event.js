"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Event.hasMany(models.Voucher, {
        foreignKey: "event_id",
        as: "VoucherEvent",
      });
    }
  }
  Event.init(
    {
      date: DataTypes.DATE,
      totalprice: DataTypes.DOUBLE,
    },
    {
      sequelize,
      modelName: "Event",
      freezeTableName: true,
    }
  );
  return Event;
};
