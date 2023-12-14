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

router.post(
  "/favorite/:id",
  authMiddleware.validateToken,
  userController.addFavorite
);
router.get(
  "/favorite",
  authMiddleware.validateToken,
  userController.getFavorite
);
router.delete(
  "/favorite/:id",
  authMiddleware.validateToken,
  userController.removeFavorite
);

router.get("/tenant/:id", userController.getUserInfoById);

module.exports = router;
