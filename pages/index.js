import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header title="Home" />
      <Navbar />
      <div className="intro">
        <Link href="/request-support">
          <a>Request Support</a>
        </Link>
      </div>
    </>
  );
}
