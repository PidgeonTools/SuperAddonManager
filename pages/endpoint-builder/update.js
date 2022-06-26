import React from "react";

// Bootstrap
import { Container } from "react-bootstrap";

// Components
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";

// Translations
import { useIntl } from "react-intl";
import IntlWrapper from "../../components/IntlWrapper";
import { DataInput } from "../../components/endpoint-checker/DataInput";

const Update = () => {
  const intl = useIntl();

  return (
    <>
      <IntlWrapper>
        <Header
          title={intl.formatMessage({ id: "endpoint_builder.title" })}
          description="You are a developer and want to support automatic addon updates with Super Addon Manager? Use this tool to generate/update a valid Endpoint in less than a minute!"
        />
        <Navbar />
        <Container>
          <div className="intro">Update endpoint.</div>
          <DataInput callbackFunction={console.log} />
        </Container>
      </IntlWrapper>
    </>
  );
};

export default Update;
