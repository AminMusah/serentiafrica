import Footer from "../components/Footer";
import Header from "../components/Header";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <Header />
      <main>
        <article>
          <section
            className="section hero has-bg-image opacity heroes"
            id="home"
            aria-labelledby="hero-label"
          >
            <div className="container contain">
              <p className="section-subtitle has-before reveal-left">
                Welcome to
              </p>

              <h1 className="h1 hero-title reveal-left" id="hero-label">
                Serenti Africa
              </h1>

              <div className="btn-group reveal-left">
                <Link to="/portfolio" className="btn btn-primary">
                  <span className="span">Explore more</span>

                  <i className="ri-arrow-right-s-line"></i>
                </Link>

                <Link to="/service" className="btn btn-secondary">
                  <span className="span">Our Services</span>

                  <i className="ri-arrow-right-s-line"></i>
                </Link>
              </div>
            </div>
            <div className="overlay"></div>
          </section>

          <section
            className="section about"
            id="about"
            aria-labelledby="about-label"
          >
            <div className="container">
              <div className="about-content">
                <p
                  className="section-subtitle reveal-left"
                  id="about-label"
                  data-reveal
                >
                  About Us
                </p>

                <h2 className="h2 section-title reveal-left">Serenti Africa</h2>

                <p className="section-text reveal-left">
                  Serenti Africa is a 360 degree service provider within the
                  real estate and interior design space.
                  <span className="truncate">
                    At Serenti, we hold your hand and guide you through the
                    process of property acquisition, interior design and décor
                    and property management. With us, you do not have to lift a
                    finger, just watch your dreams take up shape just as you
                    envisioned it.
                  </span>
                </p>

                <div>
                  <Link to="/about" className="btn btn-primary">
                    Read More
                  </Link>
                </div>
              </div>

              <figure className="about-banner reveal-right">
                <img
                  src="/images/photo_6034830961490902260_y.jpg"
                  width="686"
                  height="544"
                  loading="lazy"
                  alt="serinti"
                  className="w-100"
                />
              </figure>
            </div>
          </section>

          <section className="section feature" aria-labelledby="feature-label">
            <div className="container">
              <figure
                className="feature-banner img-holder reveal-left"
                style={{ "--width": "560px", "--height": "700px" }}
              >
                <img
                  src="images/photo_6034830961490902262_y.jpg"
                  width="560"
                  height="700"
                  loading="lazy"
                  alt="serinti"
                  className="img-cover"
                />
              </figure>

              <div className="feature-content">
                <p className="section-subtitle reveal-right">Why Choose Us</p>

                <h2
                  className="h2 section-title reveal-right"
                  id="feature-label"
                >
                  Extraordinary Taste
                </h2>

                <p className="section-text reveal-right">
                  At Serenti, we seek to bring your ideas to life, what’s that
                  wild interior fantasy you can’t tell anyone because they’d
                  think you’re crazy. Tell us, we’re as crazier and will move
                  heaven and earth to make it come to life. If you’re in for the
                  simple yet elegant things too, yes we will deliver.
                </p>

                <ul className="feature-list">
                  <li>
                    <div className="feature-card reveal-right">
                      <div className="card-icon">
                        <img
                          src="images/photo_6034830961490902255_y.jpg"
                          width="70"
                          height="70"
                          loading="lazy"
                          alt="serinti"
                        />
                      </div>

                      <div>
                        <h3 className="h3 card-title">Smart Home Design</h3>

                        <p className="card-text">
                          It all boils down to creating spaces we all want to
                          interact with. C’est simple!
                        </p>
                      </div>
                    </div>
                  </li>

                  <li>
                    <div className="feature-card reveal-right">
                      <div className="card-icon">
                        <img
                          src="images/photo_6034830961490902256_y.jpg"
                          width="70"
                          height="70"
                          loading="lazy"
                          alt="serinti"
                        />
                      </div>

                      <div>
                        <h3 className="h3 card-title">Exceptional Lifestyle</h3>

                        <p className="card-text">
                          We at Serenti will transform your space from drab to
                          Fab and we won't even break your bank while at it.
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>

                <Link
                  to="/portfolio"
                  className="btn btn-primary reveal-right"
                  data-reveal
                >
                  <span className="span">Explore More</span>

                  <i className="ri-arrow-right-s-line"></i>
                </Link>
              </div>

              <img
                src="images/flower.png"
                width="318"
                height="290"
                loading="lazy"
                alt="serinti"
                className="abs-img abs-img-1"
              />
            </div>
          </section>

          <section className="newsletter" aria-label="newsletter">
            <div className="newsletter-content">
              <p className="section-subtitle has-before">
                <i className="ri-checkbox-blank-circle-fill"></i>
                <span>Get every update</span>
              </p>

              <h2 className="h2">
                Subscribe to our newsletter to get latest updates and deals
              </h2>

              <form
                action="https://formsubmit.co/0a354c175202da3d25cafa102b789e03"
                method="POST"
                className="newsletter-form"
              >
                <input
                  type="email"
                  name="News Letter Subscription Email"
                  placeholder="Enter your email..."
                  required
                  className="email-field"
                />

                <button type="submit" className="btn btn-secondary">
                  <span className="span">Subscribe</span>

                  <i className="ri-arrow-right-s-line"></i>
                </button>
              </form>
            </div>
            <figure className="newsletter-banner">
              <img
                src="images/photo_6034830961490902257_y.jpg"
                width="355"
                height="356"
                loading="lazy"
                alt="newsletter banner"
              />
            </figure>
          </section>

          <section
            className="section cta-home has-bg-image-home"
            aria-labelledby="cta-label"
          >
            <div className="container">
              <div>
                <p className="section-subtitle reveal-left">Serenti Africa</p>

                <h2 className="h2 section-title reveal-left" id="cta-label">
                  Creating the space you have always dreamed of
                </h2>
              </div>

              <Link to="/contact" className="btn btn-primary reveal-right">
                <span className="span">Make An Enquiry</span>

                <i className="ri-arrow-right-line"></i>
              </Link>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}

export default Home;
