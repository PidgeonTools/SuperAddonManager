import "../scss/globals.scss";

function MyApp({ Component, pageProps }) {
  return (
    <div className="page-container">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
