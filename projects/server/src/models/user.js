"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // /**
    //  * Helper method for defining associations.
    //  * This method is not a part of Sequelize lifecycle.
    //  * The `models/index` file will call this method automatically.
    //  */
    static associate(models) {
      User.hasMany(models.Property, {
        foreignKey: "userId",
        as: "properties",
      });
      User.hasMany(models.Review, {
        foreignKey: "userId",
        as: "reviews",
      });
      User.hasMany(models.Booking, {
        foreignKey: "renterId",
        as: "renterBookings",
      });
      User.hasMany(models.Booking, {
        foreignKey: "tenantId",
        as: "tenantBookings",
      });
    }
  }
  User.init(
    {
      fullname: { type: DataTypes.STRING, allowNull: false },
      gender: DataTypes.ENUM("male", "female", "other"),
      dateofbirth: { type: DataTypes.DATE },
      username: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      password: { type: DataTypes.STRING, allowNull: false },
      phoneNumber: { type: DataTypes.STRING, allowNull: false },
      profilePicture: DataTypes.STRING,
      isVerified: DataTypes.BOOLEAN,
      role: DataTypes.ENUM("user", "tenant"),
      ktpImg: DataTypes.STRING,
      verifyToken: DataTypes.STRING,
      verifyTokenExpiry: DataTypes.DATE,
      resetToken: DataTypes.STRING,
      resetTokenExpiry: DataTypes.DATE,
      passwordUpdatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
