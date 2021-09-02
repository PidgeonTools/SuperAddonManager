import Header from "../components/Header";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Header title="Home" />
      <Navbar />
      <div className="intro">
        <a href="/request-support">Request Support</a>
      </div>
    </>
  );
}
