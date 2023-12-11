import api from "../api";

export default async function getListings() {
  try {
    const listings = await api.get("/property");
    if (listings.status === 200) {
      return listings.data.Properties;
    }
  } catch (error) {
    console.log(error.message);
  } finally {
  }
}
