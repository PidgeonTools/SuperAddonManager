import React from "react";

export const Version = ({ writeText }) => {
  return (
    <>
      <p>
        Please fill in the version number of the latest stable release of your
        addon. This should match the version number that Blender displays in the
        preferences of your addon.
      </p>
      <p>
        Please note that due to limitations your version number shouldn't
        constist of more than 3 parts, because any version number that is longer
        might lead to unexpected behaviour when checking for updates. We'd
        suggest using the Major.Minor.Patch Versioning scheme that Blender and
        many addons use.
      </p>
    </>
  );
};

export const DownloadURL = ({ allowAutomaticDownload, writeText }) => {
  return (
    <>
      Please fill in the link to the download page of your addon.{" "}
      <p>
        {allowAutomaticDownload
          ? `Since you checked allow automatic downloads, the link must be a link to the .zip file of your addon. If you can't link to a file directly because e.g. [your product is paid](...), please uncheck "allow automatic downloads"`
          : ""}
      </p>
    </>
  );
};

export const MinBlender = ({ writeText }) => {
  return (
    <>
      Please type in the latest Blender version where you know for sure that
      your addon is compatible with it. We'd suggest making your addon
      compatible with all Blender versions that receive updates, including the
      LTS versions.
    </>
  );
};

export const MaxBlender = ({ writeText }) => {
  return (
    <>
      If you are making an update for an older Blender Version, and you know for
      sure, that it won't work on newer Blender Version, please type in the
      first Blender Version where the update doesn't work due to API changes. If
      your addon works with the latest version of Blender, please leave this
      field empty!
    </>
  );
};
