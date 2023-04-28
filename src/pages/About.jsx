import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function About() {
  return (
    <>
      <Header />
      <main>
        <article>
          <section
            className="section about bg"
            id="about"
            aria-labelledby="about-label"
          >
            <div className="container">
              <div className="about-content">
                <p
                  className="section-subtitle reveal-left text-color"
                  id="about-label"
                >
                  About Us
                </p>

                <h2 className="h2 section-title reveal-left text-color">
                  Serenti Africa
                </h2>

                <p
                  className="section-text reveal-left text-color"
                  style={{ lineHeight: "4rem" }}
                >
                  Serenti Africa is a 360 degree service provider within the
                  real estate and interior design space. At Serenti, we hold
                  your hand and guide you through the process of property
                  acquisition, interior design and décor and property
                  management. With us, you do not have to lift a finger, just
                  watch your dreams take up shape just as you envisioned it.
                </p>
              </div>

              <figure className="about-banner reveal-right">
                <img
                  src="/images/photo_6034830961490902256_y.jpg"
                  width="686"
                  height="544"
                  loading="lazy"
                  alt="about Serenti Africa"
                  className="w-100"
                />
              </figure>
            </div>
            <h2
              className="main-focus"
              style={{ margin: " 6rem 2rem 1rem", textAlign: "center" }}
            >
              Message from the Founder
            </h2>

            <p
              className="text-color service-text"
              style={{ padding: "0 2rem 2rem" }}
            >
              Since its inception in 2014, Serenti has catered to clients from
              all walks of life and done many projects; fit outs for offices,
              homes, and kitchen designs, among many others.
              <br />
              As Serenti inches towards the decade mark, we have found our
              pulse; to operate right where the love started; luxury spaces that
              have personality and speak of the user’s identity and that is what
              we set out to do for the next decade; design bespoke spaces that
              ooze personality while capturing a luxurious essence.
              <br />
              If this speaks to who you are as an individual; welcome, we look
              forward to bringing your vision to life.
              <br />
              <p
                style={{ display: "flex", color: "black", marginLeft: "20px" }}
              >
                <i className="ri-quill-pen-line"></i>{" "}
                <span>
                  Vision – To be the leading provider of Interior Design,
                  Architectural and Real Estate solutions within the African Sub
                  region.
                </span>
              </p>
              <br />
              <p
                style={{ display: "flex", color: "black", marginLeft: "20px" }}
              >
                <i className="ri-quill-pen-line"></i>{" "}
                <span>
                  Mission – To create unique and modern spaces that ooze
                  authenticity and speak of the owner’s personality, while
                  incorporating sustainable options whenever possible.
                </span>
              </p>
              <br />
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}

export default About;
