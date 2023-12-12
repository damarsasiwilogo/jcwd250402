"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Property.belongsTo(models.User, {
        foreignKey: "userId",
        as: "Tenant",
      });
      Property.hasMany(models.PropertyImage, {
        foreignKey: "propertyId",
        as: "PropertyImages",
      });
      Property.belongsToMany(models.Category, {
        through: "PropertyCategory",
        foreignKey: "propertyId",
        as: "Categories",
      });
      Property.hasMany(models.PropertyRules, {
        foreignKey: "propertyId",
        as: "PropertyRules",
      });
      Property.hasMany(models.Amenity, {
        foreignKey: "propertyId",
      });
      Property.hasMany(models.Review, {
        foreignKey: "propertyId",
      });
      Property.hasMany(models.Rooms, {
        foreignKey: "propertyId",
      });
      Property.hasMany(models.AvailableDate, {
        foreignKey: "propertyId",
      });
      Property.hasOne(models.Booking, {
        foreignKey: "propertyId",
      });
    }
  }
  Property.init(
    {
      propertyName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bedCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bedroomCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      maxGuestCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bathroomCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      coverImage: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Property",
    }
  );
  return Property;
};
