const express = require("express");
const router = express.Router();

// untuk uoload gambar
const { multerUpload } = require("../lib/multer");
const authController = require("../controller/auth");
const authValidator = require("../middleware/validation/auth");
const authMiddleware = require("../middleware/auth");

router.post("/login", authController.loginHandler);

router.post(
  "/register",
  authValidator.registerValidationRules,
  authValidator.applyRegisterValidation,
  authController.userRegister
);

router.post(
  "/tenant-register",
  authValidator.tenantRegisterRules,
  authValidator.applyRegisterValidation,
  multerUpload.single("file"),
  authController.tenantRegister
);

router.post("/forgot-password", authController.forgotPassword);

router.patch(
  "/reset-password/:token",
  authValidator.newPasswordRules,
  authValidator.applyRegisterValidation,
  authController.resetPassword
);

router.patch(
  "/change-password",
  authMiddleware.validateToken,
  authValidator.newPasswordRules,
  authValidator.applyRegisterValidation,
  authController.changePassword
);

router.post("/verify-account", authController.handleVerifyEmail);

router.post("/resend-verify-account", authController.resendVerificationEmail);

module.exports = router;
// Compare this snippet from projects/server/src/controller/auth.js:
