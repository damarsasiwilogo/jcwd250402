import api from "../api";

export default async function getBookedDates(id) {
  const response = await api.get(`/booking/booked-dates/${id}`);
  return response.data;
}
