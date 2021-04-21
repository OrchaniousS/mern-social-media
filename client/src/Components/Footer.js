import React from "react";
import { Button, Grid } from "semantic-ui-react";
import { Link } from "react-router-dom";

function Footer() {
  const footer = (
    <footer>
      <Grid className="footer">
        <Grid.Row
          style={{
            display: "block",
            textAlign: "center",
            fontSize: "1rem",
            margin: "auto",
          }}
        >
          <div>
            App created by Orchan Magramov{" "}
            <Button
              size="mini"
              as={Link}
              to="https://www.linkedin.com/in/orchan-magramov"
              color="linkedin"
              icon="linkedin"
            />{" "}
            <Button
              size="mini"
              as={Link}
              to="https://github.com/OrchaniousS"
              icon="github"
            />
          </div>
        </Grid.Row>
      </Grid>
    </footer>
  );
  return footer;
}

export default Footer;
