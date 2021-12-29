import React, { useState } from "react";

// Bootstrap
import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";

// Components
import Dropzone from "react-dropzone";

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
      {/* INTRO INFORMATION */}
      <Row>
        <h1>Endpoint JSON Checker</h1>
        <p>
          Check and fix your Endpoint JSON File. Drag'n Drop/Select your file or
          enter the Endpoint URL and click "Go" to check your file:
        </p>
      </Row>
      {/* DROPZONE */}
      <Row>
        <Dropzone
          onDrop={handleDrop}
          accept={["application/json", "text/json"]}
          maxFiles={1}
        >
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()} />
              <p>Drag’n Drop your file here or click to select a file.</p>
            </div>
          )}
        </Dropzone>
      </Row>
      {/* Enter the file URL */}
      {/* <section className="form endpoint-checker-enter-url">
        <Form
          noValidate
          onSubmit={handleSubmit}
          className={validated ? "sam-validation" : ""}
        >
          <Row>
            <Col lg={10} className="endpoint-checker-enter-url--first">
              <FloatingLabel
                controlId="endpoint_url"
                label="Load file from URL"
              >
                <Form.Control
                  type="text"
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
              <Button variant="primary" type="submit">
                Go
              </Button>
            </Col>
          </Row>
        </Form>
      </section> */}
    </>
  );
};
