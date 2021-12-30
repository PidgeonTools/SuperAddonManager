import React from "react";

// Bootstrap
import { Button, Col, Row } from "react-bootstrap";

// Translations
import { FormattedMessage } from "react-intl";

// Functions
import { downloadJSONFile } from "../../functions";

export const DownloadFixedFile = ({ data, filename }) => {
  return (
    <>
      <Row>
        <h1>
          <FormattedMessage id="endpoint_checker.download_fixed_file.you_are_good_to_go" />
        </h1>
        <p>
          <FormattedMessage id="endpoint_checker.download_fixed_file.we_have_fixed_all_errors" />{" "}
          <FormattedMessage id="endpoint_checker.download_fixed_file.you_can_download_your_file" />{" "}
          <a>
            <FormattedMessage id="endpoint_checker.download_fixed_file.tell_everyone_that_you_fixed_it" />
          </a>
        </p>
        <Col className="d-grid">
          <Button
            onClick={() => {
              downloadJSONFile(document, data, "Fixed - " + filename);
            }}
          >
            <FormattedMessage id="endpoint_checker.download_fixed_file.download" />
          </Button>
        </Col>
      </Row>
    </>
  );
};
