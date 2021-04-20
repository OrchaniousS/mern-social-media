import React from "react";
import { Grid, Button, Form } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { FETCH_POSTS_QUERY } from "../Util/graphql";
import { useForm } from "../Util/hooks";

function PostForm() {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: "",
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      data.getPosts = [result.data.createPost, ...data.getPosts];
      proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
      values.body = "";
    },
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <Grid columns={3}>
      <Grid.Row>
        <Form onSubmit={onSubmit}>
          <h2>Share a post:</h2>
          <Form.Field>
            <Form.Input
              placeholder="Your thoughts?..."
              name="body"
              onChange={onChange}
              value={values.body}
              error={error ? true : false}
            />
            <Button
              disabled={values.body.trim() === ""}
              icon="send"
              type="submit"
              color="red"
            />
          </Form.Field>
        </Form>
      </Grid.Row>
      <Grid.Row>
        {error && (
          <div className="ui error message" style={{ marginBottom: 20 }}>
            <ul className="list">
              <li>{error.graphQLErrors[0].message}</li>
            </ul>
          </div>
        )}
      </Grid.Row>
    </Grid>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;
