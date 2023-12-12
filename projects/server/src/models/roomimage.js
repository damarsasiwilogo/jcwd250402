"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RoomImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RoomImage.belongsTo(models.Rooms, {
        foreignKey: "roomID",
        as: "roomImages",
      });
    }
  }
  RoomImage.init(
    {
      roomID: DataTypes.INTEGER,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "RoomImage",
    }
  );
  return RoomImage;
};
