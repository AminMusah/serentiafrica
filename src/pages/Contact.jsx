import Footer from "../components/Footer";
import Header from "../components/Header";

function Contact() {
  return (
    <>
      <Header />
      <main>
        <article>
          <section className="section service" aria-label="service">
            <h2 className="main-team reveal-left">Keep In Touch</h2>

            <div className="container">
              <ul className="grid-list">
                <li>
                  <a href="tel:024 636 8932" className="service-card">
                    <figure className="card-banner">
                      <img
                        src="/images/call.avif"
                        width="450"
                        height="350"
                        loading="lazy"
                        alt="Call"
                        className="img-cover"
                      />
                    </figure>

                    <div className="card-content has-before">
                      <i className="ri-phone-fill"></i>
                      <h3 className="h3 card-title">Call Us</h3>
                    </div>
                  </a>
                </li>

                <li>
                  <a href="#appointment" className="service-card">
                    <figure className="card-banner">
                      <img
                        src="/images/sendmail.avif"
                        width="450"
                        height="350"
                        loading="lazy"
                        alt="Email"
                        className="img-cover"
                      />
                    </figure>

                    <div className="card-content has-before">
                      <i className="ri-mail-fill"></i>
                      <h3 className="h3 card-title">Email Us</h3>
                    </div>
                  </a>
                </li>

                <li>
                  <a href="#" className="service-card">
                    <figure className="card-banner">
                      <img
                        src="/images//whatsapp.avif"
                        width="450"
                        height="350"
                        loading="lazy"
                        alt="Whatsapp"
                        className="img-cover"
                      />
                    </figure>

                    <div className="card-content has-before">
                      <i className="ri-whatsapp-fill"></i>
                      <h3 className="h3 card-title">Message Us On Whatsapp</h3>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </section>

          <section className="contact" id="appointment">
            <h2 className="main-team reveal-left">Contact Us</h2>

            <form
              action="https://formsubmit.co/0a354c175202da3d25cafa102b789e03"
              method="POST"
              className="contact-form"
            >
              <div className="input-wrapper">
                <input
                  type="text"
                  id="Name"
                  name="Name"
                  placeholder="Full Name.."
                  required
                />
                <input
                  type="tel"
                  id="phone"
                  name="Phone Number"
                  placeholder="Phone Number"
                  required
                />
              </div>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="fname"
                  name="Email"
                  placeholder="Email"
                  required
                />
                <select
                  name="Service"
                  id="service"
                  className="input-field"
                  required
                >
                  <option value="Interior Design">Interior Design</option>
                  <option value="Property Management">
                    Property Management
                  </option>
                  <option value="Real Estate Brokage">
                    Real Estate Brokage
                  </option>
                  <option value="Property Development">
                    Property Development
                  </option>
                  <option value="Enquiry">Enquiry</option>
                </select>
              </div>
              <div class="input-wrapper">
                <textarea
                  id="message"
                  name="Message"
                  placeholder="Your Message.."
                  style={{ height: "200px" }}
                  required
                ></textarea>
              </div>

              <button className="btn btn-secondary contact-button">
                <span className="span">Send Message</span>
              </button>
            </form>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}

export default Contact;
