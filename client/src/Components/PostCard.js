import React, { useContext } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { Button, Card, Icon, Label, Image } from "semantic-ui-react";

import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
import { AuthContext } from "../Context/auth";

function PostCard({
  post: { body, createdAt, id, username, likeCount, commentCount, likes },
}) {
  const { user } = useContext(AuthContext);
  function commentPost() {}

  const deleteButton = user && user.username === username && (
    <DeleteButton postId={id} />
  );

  return (
    <Card fluid style={{ boxShadow: "0 0 0.1rem black" }}>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header>{username} Online/Offline</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow()} by {username}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likeCount }} />
        <Button
          as={Link}
          to={`/posts/${id}`}
          labelPosition="right"
          onClick={commentPost}
        >
          <Button basic color="grey">
            <Icon name="comments" />
          </Button>
          <Label basic color="grey" pointing="left">
            {commentCount}
          </Label>
        </Button>
        {deleteButton}
      </Card.Content>
    </Card>
  );
}

export default PostCard;
