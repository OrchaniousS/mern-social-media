import React from "react";
import { Button } from "semantic-ui-react";

function Footer() {
  const footer = (
    <footer>
      <div>
        App created by Orchan Magramov{" "}
        <a href="https://www.linkedin.com/in/orchan-magramov">
          <Button size="mini" color="linkedin" icon="linkedin" />
        </a>{" "}
        <a href="https://github.com/OrchaniousS">
          <Button size="mini" icon="github" />
        </a>
      </div>
    </footer>
  );
  return footer;
}

export default Footer;
