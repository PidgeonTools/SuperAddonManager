import Link from "next/link";
import ExternalLink from "../../components/ExternalLink";

export const getI18nLink = ({ href, ...props }) => {
  const InnerComponent = (children) => {
    return (
      <Link href={href} passHref>
        {props.target === "_blank" ? (
          <ExternalLink {...props}>{children}</ExternalLink>
        ) : (
          <a {...props}>{children}</a>
        )}
      </Link>
    );
  };

  return InnerComponent;
};

export const I18nBold = (children) => {
  return <strong>{children}</strong>;
};

export const I18nItalic = (children) => {
  return <i>{children}</i>;
};

const I18nFormatters = {
  b: I18nBold,
  i: I18nItalic,
};

export default I18nFormatters;
