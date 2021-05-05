import React, { useContext } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { Card, Image } from "semantic-ui-react";
import { RiRadioButtonLine } from "react-icons/ri";
import { useQuery } from "@apollo/react-hooks";

import UserCard from "./UserCard";
import LikeButton from "./LikeButton";
import PostsButton from "./PostsButton";
import DeleteButton from "./DeleteButton";
import { AuthContext } from "../Context/auth";
import { FETCH_USER_QUERY } from "../Util/graphql";

function PostCard({
  post: { body, createdAt, id, username, likeCount, commentCount, likes },
}) {
  const { user } = useContext(AuthContext);

  const { data: { getUsers: getUserData } = {} } = useQuery(FETCH_USER_QUERY);

  const deleteButton = user && user.username === username && (
    <DeleteButton postId={id} />
  );

  // const { logo } = getUserData.filter(
  //   (item) => item.username === username && item
  // )[0];

  // console.log(logo);

  function statusIndication(x) {
    for (var user of x) {
      if (user.username === username) {
        if (user.status === "online")
          return <RiRadioButtonLine className="activeUser" />;
        if (user.status === "offline")
          return <RiRadioButtonLine className="unActiveUser" />;
      }
    }
  }

  return (
    <Card fluid style={{ boxShadow: "0 0 0.1rem black" }}>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src={UserCard(getUserData, username)}
          // onerror="this.src='
          // https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header style={{ margin: "auto" }}>
          {getUserData && statusIndication(getUserData)} {username}
        </Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow()} by {username}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likeCount }} />
        <PostsButton post={{ id, commentCount }} />
        {deleteButton}
      </Card.Content>
    </Card>
  );
}

export default PostCard;
