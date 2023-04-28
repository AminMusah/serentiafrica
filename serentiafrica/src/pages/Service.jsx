import Footer from "../components/Footer";
import Header from "../components/Header";

function Service() {
  return (
    <>
      <Header />
      <main>
        <article>
          <section
            className="section cta has-bg-image service-banner"
            aria-labelledby="cta-label"
            style={{
              backgroundImage: 'url("/images/photo_6034830961490902250_y.jpg")',
            }}
          ></section>

          <section className="section service" aria-label="service">
            <div className="container">
              <h2 className="main-focus">Our Services</h2>
              <ul className="grid-list">
                <li>
                  <a href="#" className="service-card">
                    <figure className="card-banner">
                      <img
                        src="/images/photo_6034830961490902255_y.jpg"
                        width="450"
                        height="350"
                        loading="lazy"
                        alt="Interior Design"
                        className="img-cover"
                      />
                    </figure>

                    <div className="card-content has-before">
                      <i className="ri-building-2-fill"></i>
                      <h3 className="h3 card-title">
                        Interior Design and Décor
                      </h3>
                    </div>
                  </a>
                  <h3
                    className="h3 card-title text-color"
                    style={{ color: "var(--gold)", margin: "2rem 0 0 0" }}
                  >
                    Interior Design and Décor
                  </h3>

                  <p className="text-color service-text">
                    If there is one language we speak at Serenti, that is the
                    language of luxury and comfort, after you have purchased
                    your property or acquired your new office space, we are
                    happy to help you furnish it to the highest standards.
                  </p>
                </li>

                <li>
                  <a href="#" className="service-card">
                    <figure className="card-banner">
                      <img
                        src="/images/photo_6034830961490902261_y.jpg"
                        width="450"
                        height="350"
                        loading="lazy"
                        alt="Property Management"
                        className="img-cover"
                      />
                    </figure>

                    <div className="card-content has-before">
                      <i className="ri-building-2-fill"></i>
                      <h3 className="h3 card-title">Property Management</h3>
                    </div>
                  </a>
                  <h3
                    className="h3 card-title text-color"
                    style={{ color: "var(--gold)", margin: " 2rem 0 0 0" }}
                  >
                    Property Management
                  </h3>
                  <p className="text-color service-text">
                    For our clients who are property developers and clients who
                    purchase property for Investment purposes, we understand
                    that you do not have the time to manage your apartment
                    complex or apartment unit. Whether it is maintaining the
                    common areas and marketing the complex to bring clients
                    through, Serenti has got you totally covered.
                  </p>
                </li>

                <li>
                  <a href="#" className="service-card">
                    <figure className="card-banner">
                      <img
                        src="/images/photo_6034830961490902260_y.jpg"
                        width="450"
                        height="350"
                        loading="lazy"
                        alt="Real Estate Brokage"
                        className="img-cover"
                      />
                    </figure>

                    <div className="card-content has-before">
                      <i className="ri-building-2-fill"></i>
                      <h3 className="h3 card-title">Real Estate Brokage</h3>
                    </div>
                  </a>
                  <h3
                    className="h3 card-title text-color"
                    style={{ color: "var(--gold)", margin: "2rem 0 0 0" }}
                  >
                    Real Estate Brokage
                  </h3>
                  <p className="text-color service-text">
                    We have a vast array of apartments, town homes, apartments
                    and stand alone homes on our portfolio from renowned Real
                    Estate developers in Ghana and beyond and we are happy to
                    stand by you as your trusted agents of choice.
                  </p>
                </li>

                <li>
                  <a href="#" className="service-card">
                    <figure className="card-banner">
                      <img
                        src="/images/photo_6034830961490902250_y.jpg"
                        width="450"
                        height="350"
                        loading="lazy"
                        alt="Property Development"
                        className="img-cover"
                      />
                    </figure>

                    <div className="card-content has-before">
                      <i className="ri-building-2-fill"></i>
                      <h3 className="h3 card-title">Real Estate Consulting</h3>
                    </div>
                  </a>
                  <h3
                    className="h3 card-title text-color"
                    style={{ color: "var(--gold)", margin: "2rem 0 0 0" }}
                  >
                    Real Estate Consulting
                  </h3>
                  <p className="text-color service-text">
                    We have almost a decade’s worth of knowledge and experience
                    within the Real Estate Space in Ghana in the areas of Land
                    acquisition, Property Acquisition for Investment purposes or
                    otherwise and we are happy to guide you along the path of
                    owning your own piece of real estate here in Ghana.
                  </p>
                </li>
              </ul>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}

export default Service;
