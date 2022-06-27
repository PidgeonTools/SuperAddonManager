import React from "react";
import { useRouter } from "next/router";

// Bootstrap
import { Container } from "react-bootstrap";

// Components
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";

// Translations
import { useIntl } from "react-intl";
import IntlWrapper from "../../components/IntlWrapper";
import { DataInput } from "../../components/endpoint-checker/DataInput";

// Schema
import SCHEMA from "../../components/endpoint-checker/Schema";
const Ajv = require("ajv");
const ajv = new Ajv();

const Update = () => {
  const intl = useIntl();
  const router = useRouter();

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
    }
  };

  return (
    <>
      <IntlWrapper>
        <Header
          title={intl.formatMessage({ id: "endpoint_updater.title" })}
          description="You are a developer and want to support automatic addon updates with Super Addon Manager? Use this tool to generate/update a valid Endpoint in less than a minute!"
        />
        <Navbar />
        <Container>
          <div className="intro">Update endpoint.</div>
          <DataInput callbackFunction={validateEndpoint} />
        </Container>
      </IntlWrapper>
    </>
  );
};

export default Update;
