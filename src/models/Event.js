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
      datestart: DataTypes.DATE,
      dateend: DataTypes.DATE,
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Event",
      freezeTableName: true,
    }
  );
  return Event;
};
