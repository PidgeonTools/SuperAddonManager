import React, { useState } from "react";

// Bootstrap
import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";

// Components
import Dropzone from "react-dropzone";

// Translations
import { FormattedMessage } from "react-intl";

export const DataInput = ({ callbackFunction }) => {
  const [validated, setValidated] = useState(false);
  const [endpointURL, setEndpointURL] = useState();

  // Handle a dropped file.
  const handleDrop = (acceptedFiles, _, event) => {
    // Prevent the browser from opening the file.
    event.preventDefault();
    event.stopPropagation();

    // Map over all accepted files
    // acceptedFiles.map((file) => {
    //   console.log(file);
    // });

    if (acceptedFiles[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        let text = reader.result;
        let data = JSON.parse(text);
        console.log(data);
        // console.log({
        //   schema_version: data.schema_version,
        //   versions: data.versions,
        // });
        callbackFunction(
          {
            schema_version: data.schema_version,
            versions: data.versions,
          },
          acceptedFiles[0].name
        );
      };
      reader.readAsText(acceptedFiles[0]);
    }
  };

  // Handle a file from a URL
  const handleSubmit = (e) => {
    e.preventDefault();
    setValidated(true);

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();

      return;
    }

    //     fetch(endpointURL, {
    //       mode: "no-cors",
    //       headers: {
    //         // "Content-Type": "application/json",
    //         "Content-Type": "text/plain",
    //       },
    //     })
    //       .then((response) => response)
    //       .then((data) => {
    //         console.log("Success:", data);
    //       })
    //       .catch((error) => {
    //         console.error("Error:", error);
    //       });

    //     console.log(e);
    //   };
    fetch(endpointURL)
      .then((res) => {
        res.json();
      })
      .then((data) => {
        console.log(data);
      });

    // console.log(e);
  };

  return (
    <>
      {/* DROPZONE */}
      <Row className="dropzone-container">
        <Dropzone
          onDrop={handleDrop}
          accept={["application/json", "text/json"]}
          maxFiles={1}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps({ className: "dropzone round-border-large" })}
            >
              <input {...getInputProps()} />
              <p>
                <FormattedMessage id="endpoint_checker.data_input.drag_and_drop" />
              </p>
            </div>
          )}
        </Dropzone>
      </Row>
      {/* Enter the file URL */}
      {/* <section className="form endpoint-checker-enter-url">
        <Form
          noValidate
          onSubmit={handleSubmit}
          className={classNames({ "sam-validation": validated })}
        >
          <Row>
            <Col lg={10} className="endpoint-checker-enter-url--first">
              <FloatingLabel
                controlId="endpoint_url"
                label={<FormattedMessage id="endpoint_checker.data_input.load_file_from_url" />}
              >
                <Form.Control
                  type="text"
                  className="sam-form-control"
                  placeholder="https://www.example.com/endpoint.json"
                  pattern="https://.+"
                  onChange={(e) => {
                    setEndpointURL(e.target.value);
                  }}
                  required
                  // accessKey="N"
                />
              </FloatingLabel>
            </Col>
            <Col lg={2} className="d-grid endpoint-checker-enter-url--last">
              <Button variant="primary" className="sam-btn-primary" type="submit">
                <FormattedMessage id="endpoint_checker.data_input.go" />
              </Button>
            </Col>
          </Row>
        </Form>
      </section> */}
    </>
  );
};
