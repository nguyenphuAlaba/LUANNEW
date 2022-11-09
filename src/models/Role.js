"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //1 role co nhieu user
      Role.hasMany(models.Staff, {
        foreignKey: "role_id",
        as: "UserRole",
      });
    }
  }
  Role.init(
    {
      rolename: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Role",
      freezeTableName: true,
    }
  );
  return Role;
};
