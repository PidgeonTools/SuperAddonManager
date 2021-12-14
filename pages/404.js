import React from "react";

// Components
import Header from "../components/Header";

const Custom404 = ({ funFact = "Lorem Ipsum sit dolor amet." }) => {
  return (
    <>
      <Header title="Error 404" />
      <h1>You’ve found a secret place.</h1>
      <div>
        If you want to, you can go home, but here’s a secret for you: Super
        Addon Manager isn’t the only addon that we created. You can download the
        other Pidgeon tools addons directly from here:
      </div>
      <div>
        Super Image Denoiser Super Fast Render Super Resolution Render Super
        Project Manager Super Easy Analytics
      </div>
      <div>Fun Fact: {funFact}</div>
    </>
  );
};

export default Custom404;
