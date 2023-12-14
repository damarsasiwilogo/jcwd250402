"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Favorite.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      Favorite.belongsTo(models.Property, {
        foreignKey: "propertyId",
        as: "property",
      });
    }
  }
  Favorite.init(
    {
      userId: DataTypes.INTEGER,
      propertyId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Favorite",
    }
  );
  return Favorite;
};
