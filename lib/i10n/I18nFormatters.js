import Link from "next/link";

export const getI18nLink = ({ href, ...linkProps }) => {
  return (children) => {
    return (
      <Link href={href}>
        <a {...linkProps}>{children}</a>
      </Link>
    );
  };
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