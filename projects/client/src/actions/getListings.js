import api from "../api";
import { toast } from "sonner";

export default async function getListings() {
  try {
    const listings = await api.get("/property");
    if (listings.status === 200) {
      return listings.data.Properties;
    }
  } catch (error) {
    toast.error(error.response.data.message);
  } finally {
  }
}
