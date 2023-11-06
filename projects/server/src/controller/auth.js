const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const { Op } = require("sequelize");
const hbs = require("handlebars");
const fs = require("fs");
const mailer = require("../lib/nodemailer");
const crypto = require("crypto");

const JWT_SECRET_KEY = "ini_JWT_loh";

// untuk nodemaoler masih belum gue pasang
exports.handleRegister = async (req, res) => {
  const {
    fullname,
    email,
    password,
    phoneNumber,
    // role
  } = req.body;

  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ email }],
    },
  });

  if (existingUser) {
    return res.status(400).json({
      ok: false,
      message: "Email already registered",
    });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const result = await User.create({
      fullname,
      email,
      password: hashPassword,
      phoneNumber,
      // role: role === "user",
    });

    // verify email by sending to email
    // const token = crypto.randomBytes(20).toString("hex");
    // const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    // const resetTokenExpiry = Date.now() + 60 * 60 * 1000;

    // const template = fs.readFileSync(__dirname + "/../email-template/");

    res.status(200).json({
      ok: true,
      message: "Register success",
      data: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      ok: false,
      message: String(err),
    });
  }
};
