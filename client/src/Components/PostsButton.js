import React from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Label } from "semantic-ui-react";

import CustomPopup from "../Util/CustomPopup";

function PostsButton({ post: { id, commentCount } }) {
  return (
    <CustomPopup type="top" content="See post comments">
      <Button as={Link} to={`/posts/${id}`} labelPosition="right">
        <Button basic color="grey">
          <Icon name="comments" />
        </Button>
        <Label basic color="grey" pointing="left">
          {commentCount}
        </Label>
      </Button>
    </CustomPopup>
  );
}

export default PostsButton;
