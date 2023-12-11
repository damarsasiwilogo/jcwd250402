"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Payment.belongsTo(models.Booking, {
        foreignKey: "bookingId",
        as: "booking",
      });
    }
  }
  Payment.init(
    {
      paymentProof: DataTypes.STRING,
      bookingId: DataTypes.INTEGER,
      totalPrice: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Payment",
    }
  );
  return Payment;
};
