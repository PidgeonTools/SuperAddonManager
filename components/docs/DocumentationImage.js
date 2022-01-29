import React from "react";

const DocumentationImage = ({
  filename,
  article = "bullshit",
  language = "Placeholder",
  localeVersions = "en",
  fileExtension = "png",
  alt = "",
  className,
  ...props
}) => {
  const basePath = "/images/docs";
  const locale = localeVersions.split(";").includes(language) ? language : "en";

  const src = `${basePath}/${locale}/${article}/${filename}.${fileExtension}`;

  className = className ? " " + className : ""
  const finalProps = {...props, src, alt, className: "img-fluid" + className}
  return (
    <>
      <div className="docs-img-wrapper">
        <img {...finalProps} />
      </div>
    </>
  );
};

export default DocumentationImage;
