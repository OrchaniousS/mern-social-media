import { useEffect, useState } from "react";
import { Button, Icon, Label } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import CustomPopup from "../Util/CustomPopup";

function LikeButton({ user, post: { id, likeCount, likes } }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
  });

  const likeButton = user ? (
    liked ? (
      <Button color="red">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button basic color="red">
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" basic color="red">
      <Icon name="heart" />
    </Button>
  );

  const pronunciationCount =
    likeCount > 1
      ? `${likeCount} people has liked this post`
      : likeCount === 0
      ? "No one has liked this post yet"
      : "1 person has liked this post";

  return (
    <CustomPopup type="top" content={pronunciationCount}>
      <Button as="div" labelPosition="right" onClick={likePost}>
        {likeButton}
        <Label basic color="red" pointing="left">
          {likeCount}
        </Label>
      </Button>
    </CustomPopup>
  );
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeButton;
