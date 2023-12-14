import { toast } from "sonner";
import api from "../api";

export default async function getFavoriteListings() {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get("/user/favorite", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
  }
}
