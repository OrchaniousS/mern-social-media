import React, { useContext } from "react";

import { AuthContext } from "../Context/auth";

function User() {
  const { user } = useContext(AuthContext);
  return <div>{user.username}</div>;
}

export default User;
