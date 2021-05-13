import { RiRadioButtonLine } from "react-icons/ri";

const UserCardData = (data, user, state) => {
  try {
    if (data) {
      for (var userX of data) {
        if (userX.username === user.username || userX.username === user)
          return state
            ? userX.logo
            : "https://react.semantic-ui.com/images/avatar/large/molly.png";
      }
    }
  } catch (err) {
    throw new Error(err);
  }
};

const UserStatus = (data, username) => {
  for (var user of data) {
    if (user.username === username) {
      if (user.status === "online")
        return <RiRadioButtonLine className="activeUser" />;
      if (user.status === "offline")
        return <RiRadioButtonLine className="unActiveUser" />;
    }
  }
};

const UserCard = {
  UserCardData,
  UserStatus,
};

export default UserCard;
