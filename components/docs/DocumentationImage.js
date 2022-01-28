import React from "react";

const DocumentationImage = ({
  filename,
  article = "bullshit",
  language = "Placeholder",
  localeVersions = "en",
  fileExtension = "png",
  ...props
}) => {
  const basePath = "/images/docs";
  const locale = localeVersions.split(";").includes(language) ? language : "en";

  const src = `${basePath}/${locale}/${article}/${filename}.${fileExtension}`;
  return (
    <>
      <div className="docs-img-wrapper">
        <img {...props} src={src} className="img-fluid" />
      </div>
    </>
  );
};

export default DocumentationImage;
