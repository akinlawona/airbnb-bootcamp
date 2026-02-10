import React from "react";
import Logo from "../logo/Logo";
import Container from "../Container";
import Menu from "./Menu";

const ProfileNavbar = () => {
  return (
    <div className="bg-gray-50 w-full shadow-xs ">
      <Container>
        <div className="flex   justify-between items-center ">
          <Logo />
          <Menu />
        </div>
      </Container>
    </div>
  );
};

export default ProfileNavbar;
