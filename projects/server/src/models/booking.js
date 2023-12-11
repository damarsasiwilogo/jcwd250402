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
      Booking.hasOne(models.Payment, {
        foreignKey: "bookingId",
        as: "payment",
      });
    }
  }
  Booking.init(
    {
      renterId: DataTypes.INTEGER,
      tenantId: DataTypes.INTEGER,
      propertyId: DataTypes.INTEGER,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      guestCount: DataTypes.INTEGER,
      totalPrice: DataTypes.INTEGER,
      status: DataTypes.ENUM(
        "pending payment",
        "pending confirmation",
        "cancelled",
        "paid",
        "confirmed",
        "checked in",
        "checked out",
        "completed"
      ),
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
