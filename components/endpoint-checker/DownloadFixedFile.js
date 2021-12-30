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
          <FormattedMessage id="endpoint_checker.download_fixed_file.aBHlVkOI3Y3PuWJ" />
        </h1>
        <p>
          <FormattedMessage id="endpoint_checker.download_fixed_file.hvHADetwP5igCuxV" />
          <a>
            <FormattedMessage id="endpoint_checker.download_fixed_file.B02AfgFPvxrEbk5Je" />
          </a>
        </p>
        <Col className="d-grid">
          <Button
            onClick={() => {
              downloadJSONFile(document, data, "Fixed - " + filename);
            }}
          >
            <FormattedMessage id="endpoint_checker.download_fixed_file.1L8InQhjo" />
          </Button>
        </Col>
      </Row>
    </>
  );
};
