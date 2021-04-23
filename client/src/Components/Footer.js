import React from "react";
import { Button } from "semantic-ui-react";
import { Link } from "react-router-dom";

function Footer() {
  const footer = (
    <footer>
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
    </footer>
  );
  return footer;
}

export default Footer;
