import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const MainPage = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default MainPage;
