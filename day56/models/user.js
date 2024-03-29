"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Device, {
        foreignKey: "user_id",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING(50),
      email: {
        type: DataTypes.STRING(100),
        unique: true,
      },
      password: {
        type: DataTypes.STRING(100),
      },
      sessionVersion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, // Set a default value if needed
      },
      token: {
        type: DataTypes.STRING(255),
      },
    },
    {
      sequelize,
      modelName: "User",
      timestamps: true,
      tableName: "users",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return User;
};
