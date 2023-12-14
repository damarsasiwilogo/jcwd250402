//client-side
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { useCallback, useMemo, useState, useEffect } from "react"; // Added imports
import { useSelector } from "react-redux";
import { toast } from "sonner";
import useLoginModal from "./useLoginModal";

const useFavorite = ({ listingId }) => {
  const navigate = useNavigate();
  const loginModal = useLoginModal();
  const userId = useSelector((state) => state.auth.userId);
  const token = useSelector((state) => state.auth.token);

  const [hasFavorited, setHasFavorited] = useState(false); // Added state

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const list = await api.get(`/user/favorite/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const favorites = list.data.favorites;

        setHasFavorited(
          favorites.some((favorite) => favorite.propertyId === listingId)
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchFavorites();
  }, [listingId, token]);

  const toggleFavorite = useCallback(
    async (e) => {
      if (!userId) {
        loginModal.onOpen();
        return; // Added return to prevent further execution
      }

      try {
        let response;

        if (hasFavorited) {
          response = await api.delete(`/user/favorite/${listingId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          response = await api.post(
            `/user/favorite/${listingId}`,
            {},
            {
              // Added empty object as second parameter
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }

        await response.data; // Changed from await response() to await response.data
        setHasFavorited(!hasFavorited); // Toggle the local state
        toast.success(
          hasFavorited ? "Removed from favorites" : "Added to favorites"
        );
      } catch (error) {
        toast.error(error.response.data.message);
      }
    },
    [userId, listingId, hasFavorited, loginModal, navigate, token]
  );

  return { hasFavorited, toggleFavorite };
};

export default useFavorite;
