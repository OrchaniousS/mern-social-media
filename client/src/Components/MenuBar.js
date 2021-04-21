import React, { useContext, useState } from "react";
import { Menu, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { AuthContext } from "../Context/auth";
import CustomPopup from "../Util/CustomPopup";

function MenuBar() {
  const { user, logout } = useContext(AuthContext);

  const pathname = window.location.pathname;
  const path = pathname === "/" ? "home" : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e, { name }) => setActiveItem(name);

  const menuBar = user ? (
    <Menu pointing secondary size="massive" color="red">
      <Menu.Item
        icon="home"
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />
      <Menu.Menu position="right">
        <CustomPopup type="menu" content="User settings">
          <Menu.Item
            content={
              <>
                {user.username}
                <Image
                  style={{
                    width: "20px",
                    height: "20px",
                    margin: "0 0.3rem",
                  }}
                  src="https://react.semantic-ui.com/images/avatar/large/molly.png"
                />
              </>
            }
            icon="settings"
            name={user.username}
            active={activeItem === user.username}
            onClick={handleItemClick}
            as={Link}
            to={`/${user.username}`}
          />
        </CustomPopup>
        <Menu.Item icon="logout" name="logout" onClick={logout} />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu pointing secondary size="massive" color="red">
      <Menu.Item
        icon="home"
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />
      <Menu.Menu position="right">
        <Menu.Item
          icon="sign-in"
          name="login"
          active={activeItem === "login"}
          onClick={handleItemClick}
          as={Link}
          to="/login"
        />
        <Menu.Item
          icon="signup"
          name="register"
          active={activeItem === "register"}
          onClick={handleItemClick}
          as={Link}
          to="/register"
        />
      </Menu.Menu>
    </Menu>
  );

  return menuBar;
}

export default MenuBar;
