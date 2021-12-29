import React, { useEffect, useState } from "react";

// Bootstrap
import { Button, Col, Form, Row } from "react-bootstrap";

// Schema
import SCHEMA, { SCHEMA_PARTS } from "./Schema";
const Ajv = require("ajv");
const ajv = new Ajv();

// Components
import { COMPONENTS } from "../endpoint-builder/EndpointBuilderInputs";

// Functions
import { padAddonVersion, padBlenderVersion } from "../../functions";

export const FixEndpoint = ({
  inputData,
  callbackFunction,
  latestSPMVersion,
  exampleBlenderLTSVersion,
}) => {
  const [data, setData] = useState(inputData);
  const [changedData, setChangedData] = useState(0); // Workaround to trigger a re-render after the data changes
  const [validated, setValidated] = useState(false);

  // Error Data
  const [errorLocation, setErrorLocation] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [schemaPart, setSchemaPart] = useState();
  const [showComponent, setShowComponent] = useState(<></>);
  const [showMessage, setShowMessage] = useState(<></>);

  // Component Data
  const [allowAutomaticDownload, setAllowAutomaticDownload] = useState(true);
  const [addonVersion, setAddonVersion] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [minimumBlenderVersion, setMinimumBlenderVersion] = useState("");

  // Check the data for issues, if the data changes.
  useEffect(() => {
    setValidated(false);
    const errors = checkSchemaErrors(data);
    // console.log("===Errors===");
    // console.log(errors);
    // console.log("======");

    // Return and invoke the callback function (This will result in the component beeing changed)
    if (errors.length == 0) {
      callbackFunction(data);
      return;
    }

    // Return, if the schema problem occurs outside the "versions" array.
    // TODO: Change this and allow fixing the Endpoint, even if it is missing
    // e.g. "schema_version" or "versions"
    if (errors.instancePath === "") {
      setSchemaPart("Undefined");
      return;
    }

    // Get the path to the property that needs to be changed.
    let path = errors.instancePath;
    if (errors.keyword === "required") {
      path = path + "/" + errors.params.missingProperty;
    }

    // Set the Path and the Error Message of the Error.
    setErrorLocation(path);
    setErrorMessage(errors.message);

    // Set the schema part (e.g. version, download_url, minimum_blender_version) that is affected by the error to determine,
    // which message and input to display.
    let path_arr = path.split("/");
    setSchemaPart(path_arr[path_arr.length - 1]);
  }, [changedData]);

  // Update the components that are displayed
  useEffect(() => {
    switch (schemaPart) {
      case SCHEMA_PARTS.VERSION:
        setShowComponent(
          <COMPONENTS.version
            latestSPMVersion={latestSPMVersion}
            addonVersion={addonVersion}
            onChange={(e) => {
              setAddonVersion(e.target.value);
            }}
            required
          />
        );
        break;
      case SCHEMA_PARTS.DOWNLOAD_URL:
        setShowComponent(
          <>
            <COMPONENTS.allow_automatic_download
              onChange={(e) => {
                setAllowAutomaticDownload(e.target.checked);
              }}
              allowAutomaticDownload={allowAutomaticDownload}
            />
            <COMPONENTS.download_url
              allowAutomaticDownload={allowAutomaticDownload}
              downloadUrl={downloadUrl}
              onChange={(e) => {
                setDownloadUrl(e.target.value);
              }}
              required
            />
          </>
        );
        setShowMessage(
          <>
            We've found an Error in {errorLocation}: {errorMessage}. The data
            that is currently filled in to this page is (data). Please enter a
            correct Download URL or uncheck "Allow Automatic Download", if an
            automatic download isn't possible.
          </>
        );
        break;
      case SCHEMA_PARTS.MINIMUM_BLENDER_VERSION:
        setShowComponent(
          <COMPONENTS.minimum_blender_version
            minimumBlenderVersion={minimumBlenderVersion}
            exampleBlenderLTSVersion={exampleBlenderLTSVersion}
            onChange={(e) => {
              setMinimumBlenderVersion(e.target.value);
            }}
          />
        );
        break;
      default:
        setShowMessage(
          <>
            <p>Use the Endpoint Builder... :(</p>
          </>
        );
        setShowComponent(<></>);
    }
  }, [
    schemaPart,
    addonVersion,
    allowAutomaticDownload,
    downloadUrl,
    minimumBlenderVersion,
  ]);

  const fixError = (e) => {
    e.preventDefault();
    setValidated(true);

    let path = errorLocation.split("/").slice(1);
    // console.log("===Path===");
    // console.log(errorLocation);
    // console.log(path);
    // console.log("======");

    let newData;
    switch (schemaPart) {
      case SCHEMA_PARTS.VERSION:
        newData = fixEntryFromPath(padAddonVersion(addonVersion), data, path);
        break;
      case SCHEMA_PARTS.DOWNLOAD_URL:
        if (downloadUrl.startsWith("https://")) {
          newData = fixEntryFromPath(downloadUrl, data, path);
        } else {
          newData = fixEntryFromPath("https://" + downloadUrl, data, path);
        }

        path[path.length - 1] = SCHEMA_PARTS.ALLOW_AUTOMATIC_DOWNLOAD;
        newData = fixEntryFromPath(allowAutomaticDownload, data, path);
        break;
      case SCHEMA_PARTS.MINIMUM_BLENDER_VERSION:
        newData = fixEntryFromPath(
          padBlenderVersion(minimumBlenderVersion),
          data,
          path
        );
        break;
    }

    console.log("===New Data===");
    console.log(newData);
    console.log("======");

    setData(newData);
    setChangedData(changedData + 1);
  };

  const checkSchemaErrors = (data) => {
    const validate = ajv.compile(SCHEMA);

    const valid = validate(data);

    if (!valid) return validate.errors[0];

    // TODO: Add code to find out, whether the files (Download URL) actually exist.
    return [];
  };

  const fixEntryFromPath = (newEntryData, data, path) => {
    // Change the last part of the Path provided by AJV
    if (path.length <= 1) {
      data[path[0]] = newEntryData;

      return data;
    }

    /* Change the element of the data that is one branch down the path.
    Example: The path to the element that needs to be changed is /versions/1/download_url
    Assuming that we're on the root of the path, moving down one branch means going to /versions.
    In this case, data.versions would be assigned the result of test(data.versions, "/1/download_url")
    This procedure repeats until the final branch is reached and the data gets actually changed.
    */
    data[path[0]] = fixEntryFromPath(
      newEntryData,
      data[path[0]],
      path.slice(1)
    );
    return data;
  };

  return (
    <>
      <div>{showMessage}</div>
      <section className="form">
        <Form
          noValidate
          onSubmit={fixError}
          className={validated ? "sam-validation" : ""}
        >
          <Row>
            <Col className="mb-3">{showComponent}</Col>
          </Row>
          <Col className="d-grid">
            <Button variant="primary" type="submit">
              Fix this!
            </Button>
          </Col>
        </Form>
      </section>
    </>
  );
};
