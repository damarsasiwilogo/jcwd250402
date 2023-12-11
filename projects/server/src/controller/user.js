const bcrypt = require("bcryptjs");
const { User } = require("../models");
const { Op } = require("sequelize");
const mailer = require("../lib/nodemailer");
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
