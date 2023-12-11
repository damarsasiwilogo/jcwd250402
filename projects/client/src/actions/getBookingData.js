import api from "../api";

export default async function getBookingData() {
  try {
    const bookingData = await api.get("/booking/my-booking/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (bookingData.status === 200) {
      const bookings = bookingData.data.bookings;
      return bookings;
    }
  } catch (error) {
    console.log(error.message);
  }
}
