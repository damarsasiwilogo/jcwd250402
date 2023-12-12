import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Menu, Button, Select } from "@mantine/core";
import getRoomsAndPropertiesData from "../actions/getRoomsAndPropertiesData.js";
import useRoomDeleteModal from "../components/hooks/useRoomDeleteModal";

const PropertiesDashboard = () => {
  const [propertiesData, setPropertiesData] = useState([]);
  const roomDeleteModal = useRoomDeleteModal();
  const [selectedPropertyName, setSelectedPropertyName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const properties = await getRoomsAndPropertiesData();
        setPropertiesData(properties.Property);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    fetchData();
  }, []);

  const uniquePropertyNames = [
    ...new Set(propertiesData.map((property) => property.propertyName)),
  ];

  const filteredProperties = propertiesData.filter(
    (property) => property.propertyName === selectedPropertyName
  );

  const handleSelectChange = (value) => {
    setSelectedPropertyName(value);
  };

  return (
    <div className="ml-5">
      <div className="flex justify-between mb-8">
        <h1 className="mb-4 ml-5 text-3xl font-normal">Rooms</h1>
      </div>
      <Select
        label="Select Property"
        data={uniquePropertyNames}
        searchable
        value={selectedPropertyName}
        onChange={handleSelectChange}
        className="w-1/4 mb-4"
      />
      {filteredProperties.length > 0 && (
        <button className="px-3 py-1.5 text-white rounded bg-primary hover:opacity-80">
          <Link
            to={`/tenant/dashboard/${filteredProperties[0].id}/create-room`}
          >
            Create Room
          </Link>
        </button>
      )}
      <table className="w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 border-gray-200">Room Name</th>
            <th className="px-4 py-2 border-gray-200">Bed</th>
            <th className="px-4 py-2 border-gray-200">Price</th>
            <th className="px-4 py-2 border-gray-200">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredProperties.map((property) =>
            property.Rooms.map((room) => (
              <tr key={room.id} className="border-b hover:bg-primary/10">
                <td className="items-center justify-center px-4 py-2 border-gray-200">
                  <div className="flex items-start justify-start ml-2 gap-x-4">
                    <img
                      className="object-fill w-10 h-10 rounded-lg"
                      src={`http://localhost:8000/api/property-asset/${room.roomImages[0]?.image}`}
                      alt="property"
                    />
                    <div className="cursor-pointer hover:text-primary">
                      {room.roomName}
                    </div>
                  </div>
                </td>
                <td className="flex flex-row items-center justify-center px-4 py-2 border-gray-200">
                  {room.maxGuestCount}
                </td>
                <td className="items-center justify-center px-4 py-2 text-center border-gray-200">
                  {room.price}
                </td>
                <td className="flex flex-row items-center justify-center px-4 py-2 border-gray-200">
                  <div className="">
                    <Menu shadow="md" width={200} color="#0256EE" radius={""}>
                      <Menu.Target>
                        <Button>Manage</Button>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item>
                          <Link to={`/edit-room/${room.id}`}>Edit Room</Link>
                        </Menu.Item>
                        <Menu.Item
                          color="red"
                          onClick={() => {
                            roomDeleteModal.setPropertyId(property.id);
                            roomDeleteModal.setRoomId(room.id);
                            roomDeleteModal.onOpen();
                          }}
                        >
                          Delete Property
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PropertiesDashboard;
