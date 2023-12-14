import React from "react";

const RoomSelect = (roomData) => {
  return (
    <div className="pb-3 border rounded">
      <div className="p-3">
        <h1>Select the room you want to stay in</h1>
      </div>

      <div className="flex flex-row items-center justify-between px-3 py-2 border-t">
        <div className="flex flex-row items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div>
            <div className="text-lg font-semibold">Room 1</div>
            <div className="text-sm text-gray-500">1 bed 1 bathroom</div>
          </div>
        </div>
        <div className="text-lg font-semibold">$100/night</div>
        <div className="px-4 py-2 text-white border rounded-md bg-primary hover:opacity-80">
          Select
        </div>
      </div>
    </div>
  );
};

export default RoomSelect;
