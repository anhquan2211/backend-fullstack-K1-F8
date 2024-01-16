"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class email extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  email.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email_to: DataTypes.STRING,
      subject: DataTypes.STRING,
      message: DataTypes.TEXT,
      status: DataTypes.BOOLEAN,
      sent_time: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "email",
      // createdAt: "created_at",
      // updatedAt: "updated_at",
    }
  );
  return email;
};
