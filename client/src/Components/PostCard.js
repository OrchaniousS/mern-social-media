import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { Button, Card, Icon, Label, Image } from "semantic-ui-react";

function PostCard({
  post: { body, createdAt, id, username, likeCount, commentCount, likes },
}) {
  const likePost = () => {
    //   like post
  };
  const commentPost = () => {
    //   comment post
  };
  return (
    <Card fluid style={{ boxShadow: "0 0 0.1rem black" }}>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow()}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button as="div" labelPosition="right" onClick={likePost}>
          <Button basic color="red">
            <Icon name="heart" />
          </Button>
          <Label basic color="red" pointing="left">
            {likeCount}
          </Label>
        </Button>
        <Button as="div" labelPosition="right" onClick={commentPost}>
          <Button basic color="grey">
            <Icon name="comments" />
          </Button>
          <Label basic color="grey" pointing="left">
            {commentCount}
          </Label>
        </Button>
      </Card.Content>
    </Card>
  );
}

export default PostCard;
