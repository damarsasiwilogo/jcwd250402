const express = require("express");
const router = express.Router();
const { multerUpload } = require("../lib/multer");
const authMiddleware = require("../middleware/auth");
const propertyController = require("../controller/property");
const multer = require("multer");

// POST
router.post(
  "/create",
  multerUpload.array("images", 5),
  authMiddleware.validateToken,
  propertyController.createProperty
);

// PUT / PATCH
router.patch(
  "/edit/:id",
  multerUpload.array("images", 5),
  authMiddleware.validateToken,
  propertyController.editProperty
);

// DELETE
router.delete(
  "/delete/:id",
  authMiddleware.validateToken,
  propertyController.deletePropertyHandler
);

// GET
router.get("/", propertyController.getAllProperties);
router.get(
  "/tenant",
  authMiddleware.validateToken,
  propertyController.getPropertiesByUserId
);
router.get("/:id", propertyController.getPropertyById);

module.exports = router;
