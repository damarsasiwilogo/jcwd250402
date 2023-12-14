const bcrypt = require("bcryptjs");
const { User, Property, Favorite } = require("../models");
const { Op } = require("sequelize");
const mailer = require("../lib/nodemailer");
const hbs = require("handlebars");
const fs = require("fs");
const crypto = require("crypto");
const { profile } = require("console");

exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { fullname, gender, phoneNumber, dateofbirth, email, username } =
    req.body;

  try {
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }
    if (userId !== user.id) {
      return res.status(403).json({
        ok: false,
        message: "You are not authorized to update this user",
      });
    }
    if (fullname) {
      user.fullname = fullname;
    }
    if (gender) {
      user.gender = gender;
    }
    if (phoneNumber) {
      user.phoneNumber = phoneNumber;
    }

    if (email) {
      user.email = email;
      user.isVerified = false;
      user.verifyToken = tokenHash;
      user.verifyTokenExpiry = verifyTokenExpiry;

      const token = crypto.randomBytes(20).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
      const verifyTokenExpiry = addHours(new Date(), 1);
      const template = fs.readFileSync(
        __dirname + "/../email-template/verifyEmail.html",
        "utf8"
      );
      const compiledTemplate = hbs.compile(template);
      const verifyLink = `http://localhost:3000/verify-email?token=${tokenHash}`;
      const emailHtml = compiledTemplate({
        fullname: result.fullname,
        verifyLink,
      });
      await mailer({
        email: user.email,
        subject: "Verify your Nginapp Email",
        html: emailHtml,
      });
    }

    if (username) {
      const existingUsername = await User.findOne({ where: { username } });

      if (existingUsername && existingUsername.username !== user.username) {
        return res.status(400).json({
          ok: false,
          message: "Username already exists",
        });
      }

      user.username = username;
    }
    if (dateofbirth) {
      user.dateofbirth = dateofbirth;
    }
    if (req.file) {
      user.profilePicture = req.file.filename;
    } else {
      user.profilePicture = user.profilePicture || null;
    }

    await user.save();

    return res.json({
      ok: true,
      status: 200,
      message: "Profile Settings Successfully Updated",
      account: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        username: user.username,
        gender: user.gender,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error", error: error });
  }
};

exports.getUserInfo = async (req, res) => {
  const { id } = req.user;

  try {
    const userInfo = await User.findOne({
      where: {
        id: id,
      },
      attributes: [
        "id",
        "email",
        "username",
        "fullname",
        "dateofbirth",
        "gender",
        "phoneNumber",
        "profilePicture",
      ],
    });

    if (!userInfo) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    res.json({ ok: true, userInfo });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ ok: false, message: "Internal server error", error: error });
  }
};

exports.getUserInfoById = async (req, res) => {
  const { id } = req.params;

  try {
    const userInfo = await User.findOne({
      where: {
        id: id,
      },
      attributes: [
        "id",
        "email",
        "username",
        "fullname",
        "dateofbirth",
        "gender",
        "phoneNumber",
        "profilePicture",
      ],
    });

    if (!userInfo) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    res.json({ ok: true, userInfo });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ ok: false, message: "Internal server error", error: error });
  }
};

exports.addFavorite = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const property = await Property.findOne({ where: { id } });

    if (!property) {
      return res.status(404).json({ ok: false, message: "Property not found" });
    }

    const existingFavorite = await Favorite.findOne({
      where: { userId, propertyId: id },
    });

    if (existingFavorite) {
      return res
        .status(400)
        .json({ ok: false, message: "Property already in favorites" });
    }

    const favorite = await Favorite.create({ userId, propertyId: id });

    return res.json({
      ok: true,
      status: 200,
      message: "Property added to favorites",
      favorite,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error" });
  }
};

exports.getFavorite = async (req, res) => {
  const userId = req.user.id;

  try {
    const favorites = await Favorite.findAll({
      where: { userId },
      include: [
        {
          model: Property,
          as: "property",
        },
      ],
    });

    return res.json({
      ok: true,
      status: 200,
      message: "Favorites retrieved",
      favorites,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error" });
  }
};

exports.removeFavorite = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const favorite = await Favorite.findOne({
      where: { userId, propertyId: id },
    });

    if (!favorite) {
      return res.status(404).json({ ok: false, message: "Favorite not found" });
    }

    await favorite.destroy();

    return res.json({
      ok: true,
      status: 200,
      message: "Favorite removed",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error" });
  }
};
