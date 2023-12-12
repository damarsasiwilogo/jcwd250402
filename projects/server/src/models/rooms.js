"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Rooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Rooms.belongsTo(models.Property, {
        foreignKey: "propertyId",
        as: "Property",
      });
      Rooms.hasOne(models.Booking, {
        foreignKey: "roomId",
        as: "Booking",
      });
      Rooms.belongsTo(models.User, {
        foreignKey: "userId",
        as: "Tenant",
      });
      Rooms.hasMany(models.RoomImage, {
        foreignKey: "roomId",
        as: "roomImages",
      });
    }
  }
  Rooms.init(
    {
      roomName: { type: DataTypes.STRING, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      price: { type: DataTypes.INTEGER, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      maxGuestCount: { type: DataTypes.INTEGER, allowNull: false },
      bathroomCount: { type: DataTypes.INTEGER, allowNull: false },
      totalSale: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Rooms",
    }
  );
  return Rooms;
};
