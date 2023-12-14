"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.User, {
        foreignKey: "renterId",
        as: "renter",
      });
      Booking.belongsTo(models.User, {
        foreignKey: "tenantId",
        as: "tenant",
      });
      Booking.belongsTo(models.Property, {
        foreignKey: "propertyId",
        as: "property",
      });
      Booking.belongsTo(models.Rooms, {
        foreignKey: "roomId",
        as: "room",
      });
      Booking.hasOne(models.Payment, {
        foreignKey: "bookingId",
        as: "payment",
      });
    }
  }
  Booking.init(
    {
      renterId: { type: DataTypes.INTEGER, allowNull: false },
      tenantId: { type: DataTypes.INTEGER, allowNull: false },
      propertyId: { type: DataTypes.INTEGER, allowNull: false },
      roomId: DataTypes.INTEGER,
      startDate: { type: DataTypes.DATE },
      endDate: { type: DataTypes.DATE },
      guestCount: { type: DataTypes.INTEGER, allowNull: false },
      totalPrice: { type: DataTypes.INTEGER, allowNull: false },
      status: {
        type: DataTypes.ENUM(
          "pending payment",
          "pending confirmation",
          "cancelled",
          "paid",
          "confirmed",
          "checked in",
          "checked out",
          "completed"
        ),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
