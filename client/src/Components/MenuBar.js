import React, { useContext, useState } from "react";
import { Menu, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";

import { AuthContext } from "../Context/auth";
import CustomPopup from "../Util/CustomPopup";
import { FETCH_USER_QUERY } from "../Util/graphql";

function MenuBar() {
  const { user, Logout } = useContext(AuthContext);

  const pathname = window.location.pathname;
  const path = pathname === "/" ? "home" : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);

  const [logoutUser] = useMutation(USER_STATUS_MUTATION, {
    variables: {
      username: user && user.username,
      status: user && user.status,
    },
  });

  const { data: { getUsers: getUserData } = {} } = useQuery(FETCH_USER_QUERY);

  function userLogo(x) {
    for (var userX of x) {
      if (userX.username === user.username) return userX.logo;
    }
  }

  const handleItemClick = (e, { name }) => setActiveItem(name);

  const handleLogout = () => {
    logoutUser();
    Logout();
  };

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
                  src={userLogo(getUserData)}
                />
              </>
            }
            icon="settings"
            name={user.username}
            active={activeItem === user.username}
            onClick={handleItemClick}
            as={Link}
            to={`/users/${user.username}`}
          />
        </CustomPopup>
        <Menu.Item icon="logout" name="logout" onClick={handleLogout} />
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

const USER_STATUS_MUTATION = gql`
  mutation logoutUser($username: String!, $status: String!) {
    logoutUser(username: $username, status: $status) {
      username
      status
    }
  }
`;

export default MenuBar;
