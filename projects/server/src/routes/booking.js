const router = require("express").Router();
const authMiddleware = require("../middleware/auth");
const bookingController = require("../controller/booking");
const { multerUpload } = require("../lib/multer");

router.post(
  "/new",
  authMiddleware.validateToken,
  bookingController.createBooking
);

router.post(
  "/pay/:bookingId",
  multerUpload.single("paymentProof"),
  authMiddleware.validateToken,
  bookingController.createPayment
);

router.patch(
  "/accept/:id",
  authMiddleware.validateToken,
  authMiddleware.checkTenant,
  bookingController.acceptBooking
);

router.patch(
  "/reject/:id",
  authMiddleware.validateToken,
  authMiddleware.checkTenant,
  bookingController.rejectBooking
);

router.patch(
  "/cancel/:id",
  authMiddleware.validateToken,
  bookingController.cancelBooking
);

router.get(
  "/",
  authMiddleware.validateToken,
  authMiddleware.checkTenant,
  bookingController.getNewBooking
);
router.get(
  "/my-booking",
  authMiddleware.validateToken,
  bookingController.myBooking
);

router.get(
  "/payment/:bookingId",
  authMiddleware.validateToken,
  authMiddleware.checkTenant,
  bookingController.getPaymentData
);

router.get("/booked-dates/:id", bookingController.getBookedDates);

module.exports = router;
