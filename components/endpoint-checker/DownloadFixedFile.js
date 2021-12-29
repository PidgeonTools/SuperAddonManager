import React from "react";

// Bootstrap
import { Button, Col, Row } from "react-bootstrap";

// Functions
import { downloadJSONFile } from "../../functions";

export const DownloadFixedFile = ({ data, filename }) => {
  return (
    <>
      <Row>
        <h1>You're good to go</h1>
        <p>
          We've fixed all errors inside the Endpoint JSON file. You can download
          and update your file now, double check that everything works and{" "}
          <a>tell everyone that you've fixed the issue.</a>
        </p>
        <Col className="d-grid">
          <Button
            onClick={() => {
              downloadJSONFile(document, data, "Fixed - " + filename);
            }}
          >
            Download
          </Button>
        </Col>
      </Row>
    </>
  );
};
