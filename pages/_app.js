// Components
import Footer from "../components/Footer";

// Styles
import "../scss/globals.scss";

// Translations
import { IntlProvider } from "react-intl";
import { getLocaleData } from "../lib/i18n/getLocaleData";

function MyApp({ Component, pageProps }) {
  const intlProps = getLocaleData("en");
  return (
    <>
      <IntlProvider {...intlProps}>
        <Component {...pageProps} />
        <Footer />
      </IntlProvider>
    </>
  );
}

export default MyApp;
