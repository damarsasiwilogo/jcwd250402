const express = require("express");
const router = express.Router();
const userController = require("../controller/user");
const authMiddleware = require("../middleware/auth");
const { multerUpload } = require("../lib/multer");
const authValidator = require("../middleware/validation/auth");

router.patch(
  "/update-profile",
  multerUpload.single("profilePicture"),
  authMiddleware.validateToken,
  userController.updateProfile
);

// profile yang di GET = profile yang sedang login
router.get(
  "/profile",
  authMiddleware.validateToken,
  userController.getUserInfo
);

router.get("/tenant/:id", userController.getUserInfoById);

module.exports = router;
