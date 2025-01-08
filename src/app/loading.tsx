import React from "react";
import LoadingSpinner from "./components/LoadingSpinner";

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center p-10">
      <LoadingSpinner />
    </div>
  );
};

export default LoadingScreen;
