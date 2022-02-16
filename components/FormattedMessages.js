import React from "react";
import { FormattedMessage } from "react-intl";

const FormattedMessages = ({ messages }) => {
  return (
    <>
      {messages.map((message, index, array) => (
        <React.Fragment key={message}>
          <FormattedMessage {...message} />
          {index < array.length - 1 ? " " : ""}
        </React.Fragment>
      ))}
    </>
  );
};

export default FormattedMessages;
