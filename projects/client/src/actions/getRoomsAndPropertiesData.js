import api from "../api";
import { toast } from "sonner";

export default async function getRoomsAndPropertiesData() {
  try {
    const response = await api.get("/property/rooms-data/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = response.data;
    return data;
  } catch (error) {
    toast.error(error.response.data.message);
  }
}
