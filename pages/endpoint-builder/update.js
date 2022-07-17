import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Bootstrap
import { Button, Container } from "react-bootstrap";

// Components
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import InputsLayout from "../../components/endpoint-builder/InputsLayout";

// Translations
import { FormattedMessage, useIntl } from "react-intl";
import IntlWrapper from "../../components/IntlWrapper";
import { DataInput } from "../../components/endpoint-checker/DataInput";

// Functions
import { downloadJSONFile } from "../../functions";

// Schema
import SCHEMA from "../../components/endpoint-checker/Schema";
const Ajv = require("ajv");
const ajv = new Ajv();

const Update = ({ latestSPMVersion, exampleBlenderLTSVersion }) => {
  const intl = useIntl();
  const router = useRouter();

  const [data, setData] = useState({});
  const [hasData, setHasData] = useState(false);
  const [filename, setFilename] = useState("");
  const [updated, setUpdated] = useState(false);

  const validateEndpoint = (data, filename) => {
    const validate = ajv.compile(SCHEMA);

    const valid = validate(data);

    console.log(data);

    if (!valid) {
      window.sessionStorage.setItem("data", JSON.stringify(data, null, 0));
      window.sessionStorage.setItem("filename", filename);
      window.sessionStorage.setItem(
        "from",
        JSON.stringify(
          {
            path: "/endpoint-builder/update",
            displayName: "Endpoint Updater",
          },
          null,
          0
        )
      );
      router.push("/endpoint-checker");
      return;
    }

    setData(data);
    setFilename(filename);
    setHasData(true);
  };

  const handleSubmit = (currentVersion) => {
    let newData = {
      schema_version: data.schema_version,
      versions: [currentVersion, ...data.versions],
    };

    console.log(newData);
    setData(newData);
    setUpdated(true);
  };

  // Initialise the data from sessionStorage, if available.
  useEffect(() => {
    if (window.sessionStorage.getItem("data") !== null) {
      validateEndpoint(
        JSON.parse(window.sessionStorage.getItem("data")),
        window.sessionStorage.getItem("filename")
      );

      window.sessionStorage.removeItem("data");
      window.sessionStorage.removeItem("filename");
    }
  }, []);

  return (
    <>
      <IntlWrapper>
        <Header
          title={intl.formatMessage({ id: "endpoint_updater.title" })}
          description="You are a developer and want to support automatic addon updates with Super Addon Manager? Use this tool to generate/update a valid Endpoint in less than a minute!"
        />
        <Navbar />
        <Container>
          <div className="intro">
            <FormattedMessage
              id="endpoint_builder.update.update_endpoint"
              defaultMessage={"Update endpoint."}
            />
          </div>

          <>
            {updated ? (
              <>
                {/* DOWNLOAD PAGE */}
                <div>
                  <FormattedMessage
                    id="endpoint_builder.update.success_message"
                    defaultMessage={
                      "Your endpoint has been updated successfully."
                    }
                  />
                </div>
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    setUpdated(false);
                  }}
                >
                  <FormattedMessage
                    id="endpoint_builder.update.add_another_version"
                    defaultMessage={"Add another version."}
                  />
                </Button>
                <Button
                  onClick={() => {
                    downloadJSONFile(document, data, filename);
                  }}
                >
                  <FormattedMessage
                    id="endpoint_builder.update.download"
                    defaultMessage={"Download"}
                  />
                </Button>
              </>
            ) : (
              <>
                {/* DATA INPUT */}
                <>
                  {hasData ? (
                    <div className="form">
                      <InputsLayout
                        latestSPMVersion={latestSPMVersion}
                        exampleBlenderLTSVersion={exampleBlenderLTSVersion}
                        callbackFunction={handleSubmit}
                      />
                    </div>
                  ) : (
                    <DataInput callbackFunction={validateEndpoint} />
                  )}
                </>
              </>
            )}
          </>
        </Container>
      </IntlWrapper>
    </>
  );
};

export const getStaticProps = () => {
  const data = require("../../data/request-support.json");
  return {
    props: {
      exampleBlenderLTSVersion: data.exampleBlenderLTSVersion,
      latestSPMVersion: data.latestSPMVersion,
    },
  };
};

export default Update;
