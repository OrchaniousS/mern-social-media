import React from "react";
import { Popup } from "semantic-ui-react";

function CustomPopup({ type, content, children }) {
  return (
    <Popup
      inverted
      position={type === "top" ? "top center" : "center"}
      content={content}
      trigger={children}
    />
  );
}
export default CustomPopup;
