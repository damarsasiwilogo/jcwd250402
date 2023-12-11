import React from "react";
import { Loader } from "@mantine/core";

const Loading = () => {
  return (
    <div className="flex flex-row items-center justify-center text-center">
      <Loader color="#0256EE" />;
    </div>
  );
};

export default Loading;
