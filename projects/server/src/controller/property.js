const {
  Property,
  PropertyImage,
  Category,
  PropertyRules,
  Amenity,
  PropertyCategory,
} = require("../models");

exports.createProperty = async (req, res) => {
  try {
    const {
      propertyName,
      description,
      price,
      bedCount,
      bedroomCount,
      maxGuestCount,
      bathroomCount,
      propertyType,
      district,
      city,
      province,
      streetAddress,
      postalCode,
      propertyRules,
      propertyAmenities,
    } = req.body;

    const images = req.files;

    if (!images || images.length === 0) {
      return res.status(400).json({
        ok: false,
        status: 400,
        message: "Image(s) for the property are required",
      });
    }

    const imageObjects = images.map((image) => ({
      image: image.filename,
    }));

    if (!imageObjects || imageObjects.length === 0) {
      return res.status(400).json({
        ok: false,
        status: 400,
        message: "No valid images provided",
      });
    }

    const coverImage = imageObjects[0].image;

    const propertyImages = await PropertyImage.bulkCreate(imageObjects);

    const property = await Property.create(
      {
        propertyName,
        description,
        price,
        bedCount,
        bedroomCount,
        maxGuestCount,
        bathroomCount,
        coverImage: coverImage,
        userId: req.user.id,
        isActive: true,
        Categories: [
          {
            propertyType,
            district,
            city,
            province,
            streetAddress,
            postalCode,
          },
        ],
      },
      {
        include: [{ model: Category, as: "Categories" }],
      }
    );

    if (!property || !property.Categories) {
      return res.status(400).json({
        ok: false,
        status: 400,
        message: "Please fill all the fields",
      });
    }

    await Promise.all(
      propertyImages.map((image) => image.update({ propertyId: property.id }))
    );

    if (propertyRules && propertyRules.length > 0) {
      const propertyRulesObjects = propertyRules.map((rule) => ({
        rule,
        propertyId: property.id,
      }));
      await PropertyRules.bulkCreate(propertyRulesObjects);
    }

    if (propertyAmenities && propertyAmenities.length > 0) {
      const amenityObjects = propertyAmenities.map((amenity) => ({
        amenity,
        propertyId: property.id,
      }));
      await Amenity.bulkCreate(amenityObjects);
    }

    return res.status(201).json({
      ok: true,
      status: 201,
      message: "Property successfully created",
      property: {
        id: property.id,
        name: property.name,
        description: property.description,
        price: property.price,
        address: property.address,
        coverImage: property.coverImage,
        userId: property.userId,
        propertyImages,
        Categories: property.Categories,
      },
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      ok: false,
      status: 500,
      message: "Internal Server Error",
    });
  }
};

exports.editProperty = async (req, res) => {
  const {
    propertyName,
    description,
    price,
    bedCount,
    bedroomCount,
    maxGuestCount,
    bathroomCount,
    propertyType,
    district,
    city,
    province,
    streetAddress,
    postalCode,
    propertyRules,
    propertyAmenities,
  } = req.body;
  const { id } = req.params;

  try {
    const existingProperty = await Property.findByPk(id);

    if (!existingProperty) {
      return res.status(404).json({
        ok: false,
        msg: "Property not found",
      });
    }

    const images = req.files;

    if (!images || images.length === 0) {
      return res.status(400).json({
        ok: false,
        msg: "No images uploaded",
      });
    }

    await PropertyImage.destroy({
      where: {
        propertyId: existingProperty.id,
      },
    });

    existingProperty.propertyName = propertyName;
    existingProperty.description = description;
    existingProperty.price = price;
    existingProperty.bedCount = bedCount;
    existingProperty.bedroomCount = bedroomCount;
    existingProperty.maxGuestCount = maxGuestCount;
    existingProperty.bathroomCount = bathroomCount;
    existingProperty.propertyType = propertyType;
    existingProperty.district = district;
    existingProperty.city = city;
    existingProperty.province = province;
    existingProperty.streetAddress = streetAddress;
    existingProperty.postalCode = postalCode;

    await existingProperty.save();

    if (images && images.length > 0) {
      const imageObjects = images.map((image) => {
        return {
          propertyId: existingProperty.id,
          image: image.filename,
        };
      });

      const propertyImages = await PropertyImage.bulkCreate(imageObjects);
    }

    const categories = await Category.findOne({
      where: { propertyId: id },
    });

    await PropertyCategory.destroy({
      where: {
        propertyId: existingProperty.id,
      },
    });

    await PropertyCategory.bulkCreate(
      [{ propertyId: existingProperty.id, categoryId: categories.id }],
      {
        fields: ["propertyId", "categoryId"],
      }
    );

    return res.status(200).json({
      ok: true,
      message: "Property has been updated successfully",
      property: existingProperty,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      status: 500,
      msg: "Internal server error",
    });
  }
};

exports.getAllProperties = async (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  const page = parseInt(req.query.page) || 1;
  const sort = req.query.sort;
  const category = req.query.category;
  const search = req.query.search;
  const filterBy = req.query.filterBy;
  const isActive = req.query.isActive || false;

  try {
    const properties = await Property.findAll({
      include: [
        {
          model: PropertyImage,
          as: "PropertyImages",
          attributes: ["id", "image"],
        },
        {
          model: PropertyRules,
          as: "PropertyRules",
          attributes: ["id", "rule"],
        },
        {
          model: Amenity,
          as: "Amenities",
          attributes: ["id", "amenity"],
        },
        {
          model: Category,
          as: "Categories",
          attributes: [
            "propertyType",
            "district",
            "city",
            "province",
            "streetAddress",
            "postalCode",
          ],
          through: { attributes: [] },
        },
      ],
      attributes: [
        "id",
        "propertyName",
        "description",
        "price",
        "bedCount",
        "bedroomCount",
        "maxGuestCount",
        "bathroomCount",
        "coverImage",
        "userId",
        "isActive",
      ],
      where: {},
    });

    if (!properties || properties.length === 0) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "No properties found",
      });
    }

    const formattedProperties = properties.map((property) => {
      return {
        id: property.id,
        userId: property.userId,
        name: property.propertyName,
        description: property.description,
        bedCount: property.bedCount,
        bedroomCount: property.bedroomCount,
        maxGuestCount: property.maxGuestCount,
        bathroomCount: property.bathroomCount,
        price: property.price,
        coverImage: property.coverImage,
        categories: property.Categories.map((category) => ({
          id: category.id,
          propertyType: category.propertyType,
          district: category.district,
          city: category.city,
          province: category.province,
          streetAddress: category.streetAddress,
          postalCode: category.postalCode,
        })),
        amenities: property.Amenities.map((amenity) => ({
          id: amenity.id,
          amenity: amenity.amenity,
        })),
        propertyImages: property.PropertyImages.map((image) => ({
          id: image.id,
          image: image.image,
        })),
        propertyRules: property.PropertyRules.map((rule) => ({
          id: rule.id,
          rule: rule.rule,
        })),
      };
    });

    return res.status(200).json({
      ok: true,
      status: 200,
      Properties: formattedProperties,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      status: 500,
      message: "Internal Server Error",
    });
  }
};

exports.getPropertiesByUserId = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        ok: false,
        status: 400,
        message: "Please Login",
      });
    }
    const properties = await Property.findAll({
      where: {
        userId: userId,
      },
      include: [
        {
          model: PropertyImage,
          as: "PropertyImages",
          attributes: ["id", "image"],
        },
        {
          model: PropertyRules,
          as: "PropertyRules",
          attributes: ["id", "rule"],
        },
        {
          model: Amenity,
          as: "Amenities",
          attributes: ["id", "amenity"],
        },
        {
          model: Category,
          as: "Categories",
          attributes: [
            "propertyType",
            "district",
            "city",
            "province",
            "streetAddress",
            "postalCode",
          ],
          through: { attributes: [] },
        },
      ],
      attributes: [
        "id",
        "propertyName",
        "description",
        "price",
        "bedCount",
        "bedroomCount",
        "maxGuestCount",
        "bathroomCount",
        "coverImage",
        "userId",
        "isActive",
      ],
    });

    if (!properties || properties.length === 0) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "No properties found for the specified userId",
      });
    }

    const formattedProperties = properties.map((property) => {
      return {
        id: property.id,
        userId: property.userId,
        name: property.propertyName,
        description: property.description,
        bedCount: property.bedCount,
        bedroomCount: property.bedroomCount,
        maxGuestCount: property.maxGuestCount,
        bathroomCount: property.bathroomCount,
        price: property.price,
        coverImage: property.coverImage,
        categories: property.Categories.map((category) => ({
          id: category.id,
          propertyType: category.propertyType,
          district: category.district,
          city: category.city,
          province: category.province,
          streetAddress: category.streetAddress,
          postalCode: category.postalCode,
        })),
        amenities: property.Amenities.map((amenity) => ({
          id: amenity.id,
          amenity: amenity.amenity,
        })),
        propertyImages: property.PropertyImages.map((image) => ({
          id: image.id,
          image: image.image,
        })),
        propertyRules: property.PropertyRules.map((rule) => ({
          id: rule.id,
          rule: rule.rule,
        })),
      };
    });

    return res.status(200).json({
      ok: true,
      status: 200,
      Properties: formattedProperties,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      status: 500,
      message: "Internal Server Error",
    });
  }
};

exports.getPropertyById = async (req, res) => {
  const propertyId = req.params.id;

  try {
    const property = await Property.findOne({
      where: { id: propertyId },
      include: [
        {
          model: PropertyImage,
          as: "PropertyImages",
          attributes: ["id", "image"],
        },
        {
          model: PropertyRules,
          as: "PropertyRules",
          attributes: ["id", "rule"],
        },
        {
          model: Amenity,
          as: "Amenities",
          attributes: ["id", "amenity"],
        },
        {
          model: Category,
          as: "Categories",
          attributes: [
            "propertyType",
            "district",
            "city",
            "province",
            "streetAddress",
            "postalCode",
          ],
          through: { attributes: [] },
        },
      ],
      attributes: [
        "id",
        "propertyName",
        "description",
        "price",
        "bedCount",
        "bedroomCount",
        "maxGuestCount",
        "bathroomCount",
        "coverImage",
        "userId",
        "isActive",
      ],
    });

    if (!property) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "Property not found 123!",
      });
    }

    const formattedProperty = {
      id: property.id,
      userId: property.userId,
      name: property.propertyName,
      description: property.description,
      bedCount: property.bedCount,
      bedroomCount: property.bedroomCount,
      maxGuestCount: property.maxGuestCount,
      bathroomCount: property.bathroomCount,
      price: property.price,
      coverImage: property.coverImage,
      categories: property.Categories.map((category) => ({
        id: category.id,
        propertyType: category.propertyType,
        district: category.district,
        city: category.city,
        province: category.province,
        streetAddress: category.streetAddress,
        postalCode: category.postalCode,
      })),
      amenities: property.Amenities.map((amenity) => ({
        id: amenity.id,
        amenity: amenity.amenity,
      })),
      propertyImages: property.PropertyImages.map((image) => ({
        id: image.id,
        image: image.image,
      })),
      propertyRules: property.PropertyRules.map((rule) => ({
        id: rule.id,
        rule: rule.rule,
      })),
    };

    return res.status(200).json({
      ok: true,
      status: 200,
      Property: formattedProperty,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      status: 500,
      message: "Internal Server Error",
    });
  }
};

exports.deletePropertyHandler = async (req, res) => {
  const propertyId = req.params.id;
  try {
    const property = await Property.findOne({
      where: { id: propertyId },
      attributes: ["id"],
    });

    console.log(property);

    if (!property) {
      return res.status(404).json({
        ok: false,
        message: "property not found",
      });
    }

    await PropertyImage.destroy({
      where: {
        propertyId: property.id,
      },
    });

    await PropertyCategory.destroy({
      where: {
        propertyId: property.id,
      },
    });

    await PropertyRules.destroy({
      where: {
        propertyId: property.id,
      },
    });

    await Amenity.destroy({
      where: {
        propertyId: property.id,
      },
    });

    await property.destroy();

    res.status(200).json({
      ok: true,
      message: "Property has been successfully deleted",
    });
  } catch (error) {
    console.error("Property deletion error:", error);
    res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};
