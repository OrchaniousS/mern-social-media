export default function UserCard(data, user) {
  try {
    if (data) {
      for (var userX of data) {
        if (userX.username === user.username || userX.username === user)
          return (
            userX.logo ||
            "https://react.semantic-ui.com/images/avatar/large/molly.png"
          );
      }
    }
  } catch (err) {
    throw new Error(err);
  }
}
