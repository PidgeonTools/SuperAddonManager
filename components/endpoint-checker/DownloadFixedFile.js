import React from "react";

// Bootstrap
import { Button, Col, Row } from "react-bootstrap";

// Functions
import { downloadJSONFile } from "../../functions";

// Translations
import { FormattedMessage } from "react-intl";
import { getI18nLink } from "../../lib/i18n/I18nFormatters";

export const DownloadFixedFile = ({ data, filename }) => {
  return (
    <>
      <Row>
        <h1>
          <FormattedMessage id="endpoint_checker.download_fixed_file.you_are_good_to_go" />
        </h1>
        <p>
          <FormattedMessage id="endpoint_checker.download_fixed_file.we_have_fixed_all_errors" />{" "}
          <FormattedMessage
            id="endpoint_checker.download_fixed_file.you_can_download_your_file"
            values={{ link: getI18nLink({ href: "#" }) }}
          />
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
