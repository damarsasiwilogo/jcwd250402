import api from "../api";
import { toast } from "sonner";

export default async function getPropertyData(id) {
  try {
    const propertyData = await api.get(`/property/${id}`);
    if (propertyData.status === 200) {
      const property = propertyData.data.Property;
      return {
        id: property.id,
        name: property.name,
        description: property.description,
        bedCount: property.bedCount,
        bathroomCount: property.bathroomCount,
        bedroomCount: property.bedroomCount,
        maxGuestCount: property.maxGuestCount,
        price: property.price,
        coverImage: property.coverImage,
        categories: {
          propertyType: property.categories[0]?.propertyType,
          country: property.categories[0]?.country,
          city: property.categories[0]?.city,
          province: property.categories[0]?.province,
          latitude: property.categories[0]?.latitude,
          longitude: property.categories[0]?.longitude,
          streetAddress: property.categories[0]?.streetAddress,
          postalCode: property.categories[0]?.postalCode,
        },
        propertyAmenities: property.amenities,
        propertyImages: property.propertyImages,
        propertyRules: property.propertyRules,
        Owner: {
          id: property.Owner.id,
          fullname: property.Owner.fullname,
          username: property.Owner.username,
          email: property.Owner.email,
          phoneNumber: property.Owner.phoneNumber,
          profilePicture: property.Owner.profilePicture,
          isVerified: property.Owner.isVerified,
          memberSince: property.Owner.memberSince,
        },
      };
    }
  } catch (error) {
    toast.error(error.response.data.message);
  } finally {
  }
}
