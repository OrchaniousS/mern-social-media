import React, { useState, useEffect } from "react";
import { Grid, Button, Form, Container } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { FETCH_POSTS_QUERY } from "../Util/graphql";
import { useForm } from "../Util/hooks";
import CustomPopup from "../Util/CustomPopup";

function PostForm() {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: "",
  });

  const [isDesktop, setIsDesktop] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 769) {
        setIsDesktop(true);
        setIsMobile(false);
      } else {
        setIsMobile(true);
        setIsDesktop(false);
      }
    }
    window.addEventListener("resize", handleResize);
  }, []);

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

  const isMobileOrDesktop = {
    width: isDesktop ? "100% !important" : isMobile ? "80% !important" : "",
    margin: "auto",
    // boxShadow: "0 0 0 0.08rem red",
    borderRadius: "0.2rem",
    padding: "1.2rem ",
  };

  return (
    <Container fluid style={isMobileOrDesktop}>
      <Grid centered>
        <Grid.Row>
          <Form onSubmit={onSubmit}>
            <Form.Field>
              <Grid>
                <div>
                  <h2>Share a post: </h2>
                  <Form.Input
                    placeholder="Your thoughts?..."
                    name="body"
                    onChange={onChange}
                    value={values.body}
                    error={error ? true : false}
                  />

                  <CustomPopup type="top" content="Send you post...">
                    <Button
                      // disabled={values.body.trim() === ""}
                      icon="send"
                      type="submit"
                      color="red"
                    />
                  </CustomPopup>
                </div>
              </Grid>
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
    </Container>
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
