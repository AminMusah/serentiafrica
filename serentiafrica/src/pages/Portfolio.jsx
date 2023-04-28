import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

function Portfolio() {
  const [filter, setFilter] = useState(1);

  const toggleFilter = (index) => {
    setFilter(index);
  };
  return (
    <>
      <Header />
      <main>
        <article>
          <section
            className="section blog"
            id="blog"
            aria-labelledby="blog-label"
          >
            <div className="container">
              <p className="main-team">Our Portfolio</p>

              <p className="text-color">
                Your decision to work with Serenti Africa means you’re choosing
                a world of endless limitless options. Right from your
                architectural drawings, all the way to choices of materials for
                your building and finally the finishes. You really are spoilt
                for choice. But don’t let us be the ones to tell you, come and
                experience it for yourself.
              </p>

              <ul className="filter-list">
                <li>
                  <button
                    className={
                      filter === 1
                        ? "main-filter-btn main-tab-btn active "
                        : "main-filter-btn main-tab-btn"
                    }
                    onClick={() => toggleFilter(1)}
                    data-filter-btn
                  >
                    Residential
                  </button>
                </li>

                <li>
                  <button
                    className={
                      filter === 2
                        ? "main-filter-btn main-tab-btn active "
                        : "main-filter-btn main-tab-btn"
                    }
                    onClick={() => toggleFilter(2)}
                    data-filter-btn
                  >
                    Commercial
                  </button>
                </li>
              </ul>

              <div
                className={
                  filter === 1
                    ? "main-tab-content main-active-content"
                    : "disable-content"
                }
              >
                <ul className="filter-list">
                  <li>
                    <button
                      className="filter-btn tab-btn active"
                      data-filter-btn
                    >
                      Project 0
                    </button>
                  </li>
                  {/* <!-- 
                <li>
                  <button class="filter-btn tab-btn" data-filter-btn>
                    Landing Page
                  </button>
                </li>

                <li>
                  <button class="filter-btn tab-btn" data-filter-btn>
                    iOS App
                  </button>
                </li>

                <li>
                  <button class="filter-btn tab-btn" data-filter-btn>
                    Landing Page
                  </button>
                </li>

                <li>
                  <button class="filter-btn tab-btn" data-filter-btn>
                    Branding Design
                  </button>
                </li> --> */}
                </ul>

                <ul className="grid-list portfolio-grid tab-content active-content">
                  <p className="text-color">
                    The goal for "Project O" was to create interiors that made a
                    compelling case for its price on the real estate sales
                    market. The end result; we delivered interiors that would
                    wow any buyer from the very first visit.
                  </p>
                  <li>
                    <a href="#" className="blog-card has-before">
                      <figure className="card-banner">
                        <img
                          src="/images/photo_6034830961490902251_y.jpg"
                          width="670"
                          height="450"
                          loading="lazy"
                          alt="Living room"
                          className="img-cover"
                        />
                      </figure>

                      <div className="card-content">
                        {/* <!-- <h3 class="h3 card-title">SWR React Hooks With Next Increm Ental Static Regeneration</h3> --> */}
                      </div>
                    </a>
                  </li>

                  <li>
                    <a href="#" className="blog-card has-before">
                      <figure className="card-banner">
                        <img
                          src="/images/photo_6034830961490902259_y.jpg"
                          width="670"
                          height="450"
                          loading="lazy"
                          alt="Kitchen"
                          className="img-cover"
                        />
                      </figure>

                      <div className="card-content">
                        {/* <!-- <h3 class="h3 card-title">SWR React Hooks With Next Increm Ental Static Regeneration</h3> --> */}
                      </div>
                    </a>
                  </li>

                  <li>
                    <a href="#" className="blog-card has-before">
                      <figure className="card-banner">
                        <img
                          src="/images/photo_6034830961490902252_y (1).jpg"
                          width="670"
                          height="450"
                          loading="lazy"
                          alt="bathroom"
                          className="img-cover"
                        />
                      </figure>

                      <div className="card-content">
                        {/* <!-- <h3 class="h3 card-title">SWR React Hooks With Next Increm Ental Static Regeneration</h3> --> */}
                      </div>
                    </a>
                  </li>

                  <li>
                    <a href="#" className="blog-card has-before">
                      <figure className="card-banner">
                        <img
                          src="/images/photo_6034830961490902250_y.jpg"
                          width="670"
                          height="450"
                          loading="lazy"
                          alt="living room"
                          className="img-cover"
                        />
                      </figure>

                      <div className="card-content">
                        {/* <!-- <h3 class="h3 card-title">SWR React Hooks With Next Increm Ental Static Regeneration</h3> --> */}
                      </div>
                    </a>
                  </li>

                  <li>
                    <a href="#" className="blog-card has-before">
                      <figure className="card-banner">
                        <img
                          src="/images/photo_6034830961490902255_y.jpg"
                          width="670"
                          height="450"
                          loading="lazy"
                          alt="living room"
                          className="img-cover"
                        />
                      </figure>

                      <div className="card-content">
                        {/* <!-- <h3 class="h3 card-title">SWR React Hooks With Next Increm Ental Static Regeneration</h3> --> */}
                      </div>
                    </a>
                  </li>

                  <li>
                    <a href="#" className="blog-card has-before">
                      <figure className="card-banner">
                        <img
                          src="/images/photo_6034830961490902256_y.jpg"
                          width="670"
                          height="450"
                          loading="lazy"
                          alt="stairs"
                          className="img-cover"
                        />
                      </figure>

                      <div className="card-content">
                        {/* <!-- <h3 class="h3 card-title">SWR React Hooks With Next Increm Ental Static Regeneration</h3> --> */}
                      </div>
                    </a>
                  </li>

                  <li>
                    <a href="#" className="blog-card has-before">
                      <figure className="card-banner">
                        <img
                          src="/images/photo_6034830961490902257_y.jpg"
                          width="670"
                          height="450"
                          loading="lazy"
                          alt="Wardrope"
                          className="img-cover"
                        />
                      </figure>

                      <div className="card-content">
                        {/* <!-- <h3 class="h3 card-title">SWR React Hooks With Next Increm Ental Static Regeneration</h3> --> */}
                      </div>
                    </a>
                  </li>

                  <li>
                    <a href="#" className="blog-card has-before">
                      <figure className="card-banner">
                        <img
                          src="/images/photo_6034830961490902254_y.jpg"
                          width="670"
                          height="450"
                          loading="lazy"
                          alt="Wardrope"
                          className="img-cover"
                        />
                      </figure>

                      <div className="card-content">
                        {/* <!-- <h3 class="h3 card-title">SWR React Hooks With Next Increm Ental Static Regeneration</h3> --> */}
                      </div>
                    </a>
                  </li>

                  <li>
                    <a href="#" className="blog-card has-before">
                      <figure className="card-banner">
                        <img
                          src="/images/photo_6034830961490902259_y.jpg"
                          width="670"
                          height="450"
                          loading="lazy"
                          alt="Kitchen"
                          className="img-cover"
                        />
                      </figure>

                      <div className="card-content">
                        {/* <!-- <h3 class="h3 card-title">SWR React Hooks With Next Increm Ental Static Regeneration</h3> --> */}
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="blog-card has-before">
                      <figure className="card-banner">
                        <img
                          src="/images/photo_6034830961490902250_y.jpg"
                          width="670"
                          height="450"
                          loading="lazy"
                          alt="living room"
                          className="img-cover"
                        />
                      </figure>

                      <div className="card-content">
                        {/* <!-- <h3 class="h3 card-title">SWR React Hooks With Next Increm Ental Static Regeneration</h3> --> */}
                      </div>
                    </a>
                  </li>

                  <li>
                    <a href="#" className="blog-card has-before">
                      <figure className="card-banner">
                        <img
                          src="/images/photo_6034830961490902251_y.jpg"
                          width="670"
                          height="450"
                          loading="lazy"
                          alt="living room"
                          className="img-cover"
                        />
                      </figure>

                      <div className="card-content">
                        {/* <!-- <h3 class="h3 card-title">SWR React Hooks With Next Increm Ental Static Regeneration</h3> --> */}
                      </div>
                    </a>
                  </li>

                  <li>
                    <a href="#" className="blog-card has-before">
                      <figure className="card-banner">
                        <img
                          src="/images/photo_6034830961490902252_y.jpg"
                          width="670"
                          height="450"
                          loading="lazy"
                          alt="bathroom"
                          className="img-cover"
                        />
                      </figure>

                      <div className="card-content">
                        {/* <!-- <h3 class="h3 card-title">Decisions For Building Flexible Components DevTools Browser</h3> --> */}
                      </div>
                    </a>
                  </li>

                  <li>
                    <a href="#" className="blog-card has-before">
                      <figure className="card-banner">
                        <img
                          src="/images/photo_6034830961490902254_y.jpg"
                          width="670"
                          height="450"
                          loading="lazy"
                          alt="bedroom"
                          className="img-cover"
                        />
                      </figure>

                      <div className="card-content">
                        {/* <!-- <h3 class="h3 card-title">SWR React Hooks With Next Increm Ental Static Regeneration</h3> --> */}
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="blog-card has-before">
                      <figure className="card-banner">
                        <img
                          src="/images/photo_6034830961490902255_y.jpg"
                          width="670"
                          height="450"
                          loading="lazy"
                          alt="living room"
                          className="img-cover"
                        />
                      </figure>

                      <div className="card-content">
                        {/* <!-- <h3 class="h3 card-title">SWR React Hooks With Next Increm Ental Static Regeneration</h3> --> */}
                      </div>
                    </a>
                  </li>

                  <li>
                    <a href="#" className="blog-card has-before">
                      <figure className="card-banner">
                        <img
                          src="/images/photo_6034830961490902256_y.jpg"
                          width="670"
                          height="450"
                          loading="lazy"
                          alt="Stairs"
                          className="img-cover"
                        />
                      </figure>

                      <div className="card-content">
                        {/* <!-- <h3 class="h3 card-title">Decisions For Building Flexible Components DevTools Browser</h3> --> */}
                      </div>
                    </a>
                  </li>

                  <li>
                    <a href="#" className="blog-card has-before">
                      <figure className="card-banner">
                        <img
                          src="/images/photo_6034830961490902257_y.jpg"
                          width="670"
                          height="450"
                          loading="lazy"
                          alt="Wardrope"
                          className="img-cover"
                        />
                      </figure>

                      <div className="card-content">
                        {/* <!-- <h3 class="h3 card-title">SWR React Hooks With Next Increm Ental Static Regeneration</h3> --> */}
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="blog-card has-before">
                      <figure className="card-banner">
                        <img
                          src="/images/photo_6034830961490902258_y.jpg"
                          width="670"
                          height="450"
                          loading="lazy"
                          alt="bathrrom"
                          className="img-cover"
                        />
                      </figure>

                      <div className="card-content">
                        {/* <!-- <h3 class="h3 card-title">SWR React Hooks With Next Increm Ental Static Regeneration</h3> --> */}
                      </div>
                    </a>
                  </li>

                  <li>
                    <a href="#" className="blog-card has-before">
                      <figure className="card-banner">
                        <img
                          src="/images/photo_6034830961490902259_y.jpg"
                          width="670"
                          height="450"
                          loading="lazy"
                          alt="Kitchen"
                          className="img-cover"
                        />
                      </figure>

                      <div className="card-content">
                        {/* <!-- <h3 class="h3 card-title">Decisions For Building Flexible Components DevTools Browser</h3> --> */}
                      </div>
                    </a>
                  </li>

                  <li>
                    <a href="#" className="blog-card has-before">
                      <figure className="card-banner">
                        <img
                          src="/images/photo_6034830961490902250_y.jpg"
                          width="670"
                          height="450"
                          loading="lazy"
                          alt="Living room"
                          className="img-cover"
                        />
                      </figure>

                      <div className="card-content">
                        {/* <!-- <h3 class="h3 card-title">SWR React Hooks With Next Increm Ental Static Regeneration</h3> --> */}
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="blog-card has-before">
                      <figure className="card-banner">
                        <img
                          src="/images/photo_6034830961490902251_y.jpg"
                          width="670"
                          height="450"
                          loading="lazy"
                          alt="living room"
                          className="img-cover"
                        />
                      </figure>

                      <div className="card-content">
                        {/* <!-- <h3 class="h3 card-title">SWR React Hooks With Next Increm Ental Static Regeneration</h3> --> */}
                      </div>
                    </a>
                  </li>

                  <li>
                    <a href="#" className="blog-card has-before">
                      <figure className="card-banner">
                        <img
                          src="/images/photo_6034830961490902252_y (1).jpg"
                          width="670"
                          height="450"
                          loading="lazy"
                          alt="Bathroom"
                          className="img-cover"
                        />
                      </figure>

                      <div className="card-content">
                        {/* <!-- <h3 class="h3 card-title">Decisions For Building Flexible Components DevTools Browser</h3> --> */}
                      </div>
                    </a>
                  </li>

                  <li>
                    <a href="#" className="blog-card has-before">
                      <figure className="card-banner">
                        <img
                          src="/images/photo_6034830961490902254_y.jpg"
                          width="670"
                          height="450"
                          loading="lazy"
                          alt="Bathroom"
                          className="img-cover"
                        />
                      </figure>

                      <div className="card-content">
                        {/* <!-- <h3 class="h3 card-title">SWR React Hooks With Next Increm Ental Static Regeneration</h3> --> */}
                      </div>
                    </a>
                  </li>
                </ul>

                <ul className="grid-list portfolio-grid tab-content">
                  <li>
                    <a href="#" className="blog-card has-before">
                      <figure className="card-banner">
                        <img
                          src="/images/photo_6034830961490902251_y.jpg"
                          width="670"
                          height="450"
                          loading="lazy"
                          alt="Living room"
                          className="img-cover"
                        />
                      </figure>

                      <div className="card-content">
                        {/* <!-- <h3 class="h3 card-title">SWR React Hooks With Next Increm Ental Static Regeneration</h3> --> */}
                      </div>
                    </a>
                  </li>

                  <li>
                    <a href="#" className="blog-card has-before">
                      <figure className="card-banner">
                        <img
                          src="/images/photo_6034830961490902259_y.jpg"
                          width="670"
                          height="450"
                          loading="lazy"
                          alt="Kitchen"
                          className="img-cover"
                        />
                      </figure>

                      <div className="card-content">
                        {/* <!-- <h3 class="h3 card-title">SWR React Hooks With Next Increm Ental Static Regeneration</h3> --> */}
                      </div>
                    </a>
                  </li>
                </ul>
              </div>

              {/* <!-- <a href="#" class="btn btn-primary" data-reveal>
                <span class="span">View All</span>
    
                <ion-icon name="chevron-forward" aria-hidden="true"></ion-icon>
              </a> --> */}

              <div
                className={
                  filter === 2
                    ? "main-tab-content main-active-content"
                    : "disable-content"
                }
              >
                <ul className="filter-list">
                  {/* <!-- <li>
                    <button class="filter-btn-active tab-btn " data-filter-btn>
                      Project 0
                    </button>
                  </li> --> */}

                  {/* <!-- <li>
                    <button class="filter-btn tab-btn" data-filter-btn>
                      Landing Page
                    </button>
                  </li>
    
                  <li>
                    <button class="filter-btn tab-btn" data-filter-btn>
                      iOS App
                    </button>
                  </li>
    
                  <li>
                    <button class="filter-btn tab-btn" data-filter-btn>
                      Landing Page
                    </button>
                  </li>
    
                  <li>
                    <button class="filter-btn tab-btn" data-filter-btn>
                      Branding Design
                    </button>
                  </li> --> */}
                </ul>
              </div>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}

export default Portfolio;
