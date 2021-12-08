import React, { useEffect, useState } from "react";

import { OverlayTrigger, Overlay, Tooltip } from "react-bootstrap";

// ANIMATIONS
import Typist from "react-typist";

// const CustomizedTypist = ({ exampleText, key = 0 }) => {
//   const [showText, setShowText] = useState(false);

//   return (
//     <div
//       onMouseEnter={() => {
//         setShowText(true);
//       }}
//       onClick={() => {
//         setShowText(true);
//       }}
//       className="typist-container"
//     >
//       {showText ? (
//         <Typist avgTypingDelay={150} stdTypingDelay={40} key={key}>
//           example: {exampleText}
//         </Typist>
//       ) : (
//         <div className="typist-placeholder">
//           Hover over me to see an example.
//         </div>
//       )}
//     </div>
//   );
// };

export const Version = ({ exampleText }) => {
  return (
    <>
      {/* <div>
        Please fill in the version number of the{" "}
        <strong>latest stable release</strong> of your addon. This should match
        the version number that Blender displays in the preferences of your
        addon.
      </div> */}
      <div className="endpoint-form-example-container">{exampleText}</div>
      <div>
        Please note that due to limitations your version number{" "}
        <strong>shouldn't consist of more than 3 parts</strong>, because any
        version number that is longer{" "}
        <strong>might lead to unexpected behavior</strong> when checking for
        updates. We'd suggest using the <strong>Major.Minor.Patch</strong>{" "}
        Versioning scheme that Blender and many addons use.
      </div>
    </>
  );
};

export const DownloadURL = ({ allowAutomaticDownload, exampleText }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  if (allowAutomaticDownload) {
    exampleText = "https://www.example.com/my-addon-0.0.0.zip";
  }

  return (
    <>
      <div
        onMouseLeave={() => {
          setShowTooltip(false);
        }}
      >
        Please fill in the link to the download page of your addon.{" "}
        {allowAutomaticDownload ? (
          <>
            Since you checked allow automatic downloads, the link must be a link
            to the .zip file of your addon. If you can't link to a file directly
            because e.g.{" "}
            <OverlayTrigger
              placement="top"
              show={showTooltip}
              overlay={
                <Tooltip>
                  If your addon is paid, please consider donating!
                </Tooltip>
              }
            >
              <span
                onMouseEnter={() => {
                  setShowTooltip(true);
                }}
                style={{ textDecoration: "underline" }}
              >
                your product is paid
              </span>
            </OverlayTrigger>
            , uncheck "Allow Automatic Download".
          </>
        ) : (
          ""
        )}
      </div>
      <div
        className="endpoint-form-example-container"
        key={allowAutomaticDownload}
      >
        {exampleText}
      </div>
    </>
  );
};

export const MinBlender = ({ exampleText }) => {
  return (
    <>
      <div>
        Please type in the latest Blender version where you{" "}
        <strong>know for sure</strong> that your addon is compatible with it.
        We'd suggest making your addon compatible with all Blender versions that
        receive updates, including the LTS versions.
      </div>
      <div className="endpoint-form-example-container">{exampleText}</div>
    </>
  );
};

export const MaxBlender = ({ exampleText }) => {
  return (
    <>
      <div>
        If you are making an update{" "}
        <strong>for an older Blender Version</strong>, and you know for sure,
        that it won't work on a newer Blender Version, please type in the first
        Blender Version where the update doesn't work due to API changes. If
        your addon works with the latest version of Blender,{" "}
        <strong>please leave this field empty!</strong>
      </div>
      <div className="endpoint-form-example-container">{exampleText}</div>
    </>
  );
};
