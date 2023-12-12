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

router.post(
  "/:propertyId/room/create",
  multerUpload.array("images", 5),
  authMiddleware.validateToken,
  propertyController.createRoom
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

router.delete(
  "/:propertyId/room/delete/:roomId",
  authMiddleware.validateToken,
  propertyController.deleteRoom
);

// GET
router.get("/", propertyController.getAllProperties);
router.get(
  "/tenant",
  authMiddleware.validateToken,
  propertyController.getPropertiesByUserId
);

router.get(
  "/rooms-data/",
  authMiddleware.validateToken,
  propertyController.getAllRoomsAndProperties
);

router.get("rooms/:id", propertyController.getRoomById);
router.get("/:id", propertyController.getPropertyById);

module.exports = router;
