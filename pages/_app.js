import '../scss/globals.scss'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
      <div className="page-container">
        <Component {...pageProps} />
      </div>
}

export default MyApp
