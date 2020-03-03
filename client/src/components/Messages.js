import React from "react";
import { Message } from "semantic-ui-react";

export default function Messages({ alert: { type, message } }) {
  if (type === "success") {
    return <Message success header="Success" content={message} />;
  } else if (type === "error") {
    return <Message error header="Error" content={message} />;
  }
  return null;
}
