import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top section">
          <ul className="footer-list">
            <li>
              <p className="footer-list-title">Quick Links</p>
            </li>

            <li className="footer-list-item">
              <Link to="/service">Our Services</Link>
            </li>

            <li className="footer-list-item">
              <Link to="/portfolio">Portfolio</Link>
            </li>
            <li className="footer-list-item">
              <Link to="/meettheteam">Meet The Team</Link>
            </li>
          </ul>

          <ul className="footer-list">
            <li>
              <p className="footer-list-title">Contact Us</p>
            </li>

            <li>
              <div className="wrapper">
                <i className="ri-mail-fill"></i>

                <div>
                  <span className="span">Email Address :</span>

                  <p>info@serentiafrica.com</p>
                </div>
              </div>
            </li>

            <li>
              <div className="wrapper">
                <i className="ri-phone-fill"></i>
                <div>
                  <a href="tel:024 636 8932" className="item-link">
                    Call us:024 636 8932
                  </a>
                </div>
              </div>
            </li>
          </ul>

          <ul className="footer-list">
            <li>
              <p className="footer-list-title">Social Links</p>
            </li>

            <li>
              <div className="wrapper">
                <i className="ri-instagram-fill"></i>
                <div>
                  <a
                    href="https://www.instagram.com/serenti_interiors/?hl=en"
                    target="_blank"
                  >
                    <span className="span">Instagram</span>
                  </a>
                </div>
              </div>
            </li>

            <li>
              <div className="wrapper">
                <i className="ri-facebook-box-fill"></i>

                <a
                  href="https://www.facebook.com/Ser3ntiD3signs/?ref=page_internal"
                  target="_blank"
                >
                  <span className="span">Facebook</span>
                </a>
              </div>
            </li>

            <li>
              <div className="wrapper">
                <i className="ri-whatsapp-fill"></i>
                <div>
                  <a href="https://wa.me/+233246368932" target="_blank">
                    <span className="span">Whatsapp</span>
                  </a>
                </div>
              </div>
            </li>
          </ul>

          <ul className="footer-list">
            <li>
              <p className="footer-list-title">Gallery</p>
            </li>

            <li>
              <ul className="grid-list">
                <li>
                  <div className="grid-item">
                    <img
                      src="/images/photo_6034830961490902254_y.jpg"
                      width="80"
                      height="80"
                      loading="lazy"
                      alt="Gallery"
                      className="w-100"
                    />
                  </div>
                </li>

                <li>
                  <div className="grid-item">
                    <img
                      src="/images/photo_6034830961490902255_y.jpg"
                      width="80"
                      height="80"
                      loading="lazy"
                      alt="Gallery"
                      className="w-100"
                    />
                  </div>
                </li>

                <li>
                  <div className="grid-item">
                    <img
                      src="/images/photo_6034830961490902256_y.jpg"
                      width="80"
                      height="80"
                      loading="lazy"
                      alt="Gallery"
                      className="w-100"
                    />
                  </div>
                </li>

                <li>
                  <div className="grid-item">
                    <img
                      src="/images/photo_6034830961490902257_y.jpg"
                      width="80"
                      height="80"
                      loading="lazy"
                      alt="Gallery"
                      className="w-100"
                    />
                  </div>
                </li>

                <li>
                  <div className="grid-item">
                    <img
                      src="/images/photo_6034830961490902258_y.jpg"
                      width="80"
                      height="80"
                      loading="lazy"
                      alt="Gallery"
                      className="w-100"
                    />
                  </div>
                </li>

                <li>
                  <div className="grid-item">
                    <img
                      src="/images/photo_6034830961490902259_y.jpg"
                      width="80"
                      height="80"
                      loading="lazy"
                      alt="Gallery"
                      className="w-100"
                    />
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            <span>Copyright ©</span>
            <span id="year"></span>
            <span> Serenti Africa. All Rights Reserved.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
