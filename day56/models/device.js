"use strict";
const { Model } = require("sequelize");

const User = Model.User;
module.exports = (sequelize, DataTypes) => {
  class Device extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Device.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }
  Device.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING(255),
      time_login: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users", // Assuming your users table is named 'users'
          key: "id",
        },
      },
      last_active: {
        type: DataTypes.DATE,
      },
      token: {
        type: DataTypes.STRING(255),
      },
      status: {
        type: DataTypes.BOOLEAN,
      },
      browser: {
        type: DataTypes.STRING(255),
      },
    },
    {
      sequelize,
      modelName: "Device",
      timestamps: true,
      tableName: "devices",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Device;
};
