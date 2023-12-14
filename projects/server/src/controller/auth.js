const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const { Op } = require("sequelize");
const hbs = require("handlebars");
const fs = require("fs");
const mailer = require("../lib/nodemailer");
const crypto = require("crypto");
const { addHours } = require("date-fns");
const JWT_SECRET_KEY = "ini_JWT_loh";

//* Speccifically for registering as a user role
exports.userRegister = async (req, res) => {
  const {
    fullname,
    username,
    email,
    password,
    phoneNumber,
    gender,
    dateofbirth,
    profilePicture,
    ktpImg,
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
      username,
      email,
      password: hashPassword,
      phoneNumber,
      gender,
      dateofbirth,
      profilePicture: req.file.filename,
      ktpImg,
      role: "user",
    });

    const token = crypto.randomBytes(20).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const verifyTokenExpiry = addHours(new Date(), 1);

    result.verifyToken = tokenHash;
    result.verifyTokenExpiry = verifyTokenExpiry;
    await result.save();

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
      email: result.email,
      subject: "Verify your Nginapp Account",
      html: emailHtml,
    });

    const data = {
      result,
      token: result.verifyToken,
    };

    res.status(200).json({
      ok: true,
      message: "Register success",
      data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      ok: false,
      message: String(err),
    });
  }
};

//* Speccifically for registering as a tenant role
exports.tenantRegister = async (req, res) => {
  const {
    fullname,
    username,
    email,
    password,
    phoneNumber,
    gender,
    dateofbirth,
    profilePicture,
    // ktpImg,
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
      username,
      email,
      password: hashPassword,
      phoneNumber,
      gender,
      dateofbirth,
      profilePicture: req.file.filename,
      // ktpImg,
      role: "tenant",
    });

    // verify email by sending to email
    const token = crypto.randomBytes(20).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const verifyTokenExpiry = addHours(new Date(), 1);

    result.verifyToken = tokenHash;
    result.verifyTokenExpiry = verifyTokenExpiry;
    await result.save();

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
      email: result.email,
      subject: "Verify your email address to complete your registration",
      html: emailHtml,
    });

    const data = {
      result,
      token: result.verifyToken,
    };

    res.status(200).json({
      ok: true,
      message: "Register success",
      data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      ok: false,
      message: String(err),
    });
  }
};

exports.handleVerifyEmail = async (req, res) => {
  // bring token from exports.handleRegister
  const { token } = req.body;
  // const { token } = req.query;
  console.log(token);
  // const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  try {
    const user = await User.findOne({
      where: {
        verifyToken: token,
        verifyTokenExpiry: {
          [Op.gt]: new Date(),
        },
        isVerified: null,
      },
    });
    console.log(user);
    if (!user) {
      return res.status(400).json({
        ok: false,
        message: "Token is invalid or has expired",
      });
    }

    user.isVerified = true;
    user.verifyToken = null;
    user.verifyTokenExpiry = null;
    await user.save();

    res.status(200).json({
      ok: true,
      message: "Email verified successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      ok: false,
      message: "Internal Server Error",
    });
  }
};

exports.resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "User not found",
      });
    }
    if (user.isVerified) {
      return res.status(403).json({
        ok: false,
        message: "Account already verified",
      });
    }

    // Check if the user has reached the resend limit
    const today = new Date();
    const attemptsToday = await User.count({
      where: {
        email,
        verifyTokenExpiry: {
          [Op.gt]: today.setHours(0, 0, 0, 0), // Count attempts within today
        },
      },
    });

    const MAX_RESEND_LIMIT = 5;
    if (attemptsToday >= MAX_RESEND_LIMIT) {
      return res.status(400).json({
        ok: false,
        message: "Exceeded maximum resend attempts for today",
      });
    }

    // Generate and update new verification token
    const token = crypto.randomBytes(20).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // One day expiration

    // Update user's token and expiry
    user.verifyToken = tokenHash;
    user.verifyTokenExpiry = verifyTokenExpiry;
    await user.save();

    // Send the new verification email
    const template = fs.readFileSync(
      __dirname + "/../email-template/verifyEmail.html",
      "utf8"
    );
    const compiledTemplate = hbs.compile(template);
    const verifyLink = `http://localhost:3000/verify-email?token=${tokenHash}`;
    const emailHtml = compiledTemplate({
      fullname: user.fullname,
      verifyLink,
    });

    await mailer({
      email: user.email,
      subject:
        "Resend: Verify your email address to complete your registration",
      html: emailHtml,
    });

    res.status(200).json({
      ok: true,
      message: "Resent verification email successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      ok: false,
      message: "Internal Server Error",
    });
  }
};

exports.loginHandler = async (req, res) => {
  const { user_identity, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: user_identity }, { username: user_identity }],
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid email/username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(400)
        .json({ message: "Invalid email/username or password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      ok: true,
      id: user.id,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "Email sent!",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const resetTokenExpired = new Date();
    resetTokenExpired.setTime(resetTokenExpired.getTime() + 10 * 60 * 1000);
    await User.update(
      {
        resetToken: resetTokenHash,
        resetTokenExpiry: resetTokenExpired,
      },
      {
        where: {
          email: req.body.email,
        },
      }
    );

    const template = fs.readFileSync(
      __dirname + "/../email-template/forgotPassword.html",
      "utf8"
    );
    const compiledTemplate = hbs.compile(template);
    const resetLink = `${req.protocol}://localhost:3000/reset-password/${resetTokenHash}`;
    const emailHtml = compiledTemplate({
      fullname: user.fullname,
      resetLink: resetLink,
    });

    try {
      await mailer({
        email: user.email,
        subject: "Nginapp Password Reset Request",
        html: emailHtml,
      });
      res.status(200).json({
        ok: true,
        hashedToken: resetTokenHash,
        resetTokenExpiry: resetTokenExpired,
      });
    } catch (error) {
      console.error("Error in forgotPassword:", error);
      res.status(500).json({
        ok: false,
        message: "Internal Server Error",
      });
    }
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({
      ok: false,
      message: "Internal Server Error",
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;

  try {
    const user = await User.findOne({
      where: {
        resetToken: req.params.token,
        resetTokenExpiry: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({
        ok: false,
        message: "Token is invalid or has expired",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        ok: false,
        message: "Passwords do not match",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();

    res.status(200).json({
      ok: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({
      ok: false,
      message: "Internal Server Error",
    });
  }
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { id } = req.user;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(400).json({
        ok: false,
        message: "User not found",
      });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        ok: false,
        message: "Current password is incorrect",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    user.password = hashedPassword;
    user.passwordUpdatedAt = Date.now();

    await user.save();

    res.status(200).json({
      ok: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error in changePassword:", error);
    res.status(500).json({
      ok: false,
      message: "Internal Server Error",
    });
  }
};
