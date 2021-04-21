import React, { useContext } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { Card, Image } from "semantic-ui-react";
import { RiRadioButtonLine } from "react-icons/ri";

import LikeButton from "./LikeButton";
import PostsButton from "./PostsButton";
import DeleteButton from "./DeleteButton";
import { AuthContext } from "../Context/auth";

function PostCard({
  post: { body, createdAt, id, username, likeCount, commentCount, likes },
}) {
  const { user } = useContext(AuthContext);

  const deleteButton = user && user.username === username && (
    <DeleteButton postId={id} />
  );

  const statusIndication = (x) =>
    x ? (
      <RiRadioButtonLine className="activeUser" />
    ) : (
      <RiRadioButtonLine className="unActiveUser" />
    );

  return (
    <Card fluid style={{ boxShadow: "0 0 0.1rem black" }}>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header style={{ margin: "auto" }}>
          {statusIndication(user && user.username === username)} {username}
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
