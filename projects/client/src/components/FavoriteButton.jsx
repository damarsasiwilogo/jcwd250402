import React, { useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { toast } from "sonner";
import useFavorite from "./hooks/useFavorites";

const FavoriteButton = ({ listingId, userId }) => {
  const { toggleFavorite, hasFavorited } = useFavorite({ listingId, userId });

  const handleClick = (e) => {
    e.stopPropagation();
    toggleFavorite(e);
  };

  return (
    <div
      onClick={handleClick}
      className="relative transition cursor-pointer hover:opacity-80"
    >
      <AiOutlineHeart
        size={28}
        className="
          fill-white
          absolute
          -top-[2px]
          -right-[2px]
        "
      />
      <AiFillHeart
        size={24}
        className={hasFavorited ? "fill-rose-500" : "fill-neutral-500/70"}
      />
    </div>
  );
};

export default FavoriteButton;
