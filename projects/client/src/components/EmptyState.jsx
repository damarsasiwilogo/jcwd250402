import React from "react";
import { useNavigate } from "react-router-dom";
import Heading from "./Heading";

const EmptyState = ({
  title = "No Exact Matches",
  subtitle = "Try changing or removing some filters to see more results.",
  showReset,
}) => {
  const navigate = useNavigate();
  return (
    <div>
      <div
        className="
    h-[60vh]
    flex
    flex-col
    gap-2
    justify-center
    items-center
    "
      >
        <Heading center={true} title={title} subtitle={subtitle} />
        <div className="w-48 mt-4">
          {showReset && (
            <button
              className="w-full px-4 py-2 text-white rounded-lg  bg-primary hover:bg-primary/70"
              onClick={() => navigate("/")}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
