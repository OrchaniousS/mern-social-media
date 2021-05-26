import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { Card, Image } from "semantic-ui-react";
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
  const [viewImage, setViewImage] = useState(false);

  const { data: { getUsers: getUserData } = {} } = useQuery(FETCH_USER_QUERY);

  return (
    <Card fluid>
      <Card.Content>
        <Image
          onError={() => setViewImage(true)}
          floated="right"
          size="mini"
          src={UserCard.UserCardData(getUserData, username, viewImage)}
        />
        <Card.Header style={{ margin: "auto" }}>
          {getUserData && UserCard.UserStatus(getUserData, username)} {username}
        </Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow()} by {username}
        </Card.Meta>
        <Card.Description
          style={{
            padding: "0.2rem",
            minHeight: "40px",
            height: "auto",
            overflow: "auto",
          }}
        >
          {body}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likeCount }} />
        <PostsButton post={{ id, commentCount }} />
        {user && user.username === username && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
}

export default PostCard;
