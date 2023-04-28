import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

function Meettheteam() {
  return (
    <>
      <Header />
      <main>
        <article>
          <section
            className="the-team section about"
            id="about"
            aria-labelledby="about-label"
          >
            <h2 className="main-team reveal-left">Meet The Team</h2>

            <div className="container the-team ">
              <div className="about-content">
                <p className="section-subtitle reveal-left" id="about-label">
                  Founder and Creative Director
                </p>

                <h2 className="h2 section-title reveal-left">
                  Crystal Selorm Amudzi
                </h2>

                <p className="section-text reveal-left">
                  Crystal Selorm Amudzi is the Founder and creative director of
                  Serenti Africa. “Serenti Africa” formerly “Serenti Designs”
                  was established in 2014, it started as an idea that was
                  conceived after her undergraduate studies at the University of
                  Ghana where she majored as an English student. She decided to
                  focus on her true love and went on to obtain more knowledge in
                  interiors and the interior design business by enrolling for a
                  Diploma with the Interior Design Institute, South Africa. She
                  did this while pursuing an education in Law at the same time;
                  a feat worth applauding. Her love for beautiful and organized
                  spaces inspired her to set up Serenti to cater to the needs of
                  individuals who wish to live beyond the ordinary and add a bit
                  of fancy to their spaces. Her design style is a reflection of
                  her deep love for her African heritage while balancing it out
                  with contemporary and classic elements. From the humble
                  beginnings of helping expecting parents put their spaces
                  together for their newborns to totally transforming spaces and
                  creating toddler havens for kids playrooms and bedrooms, she
                  has long grown into her style and today her projects are a
                  reflection of this growth. These projects span from
                  residential spaces, rental units, all the way to commercial
                  and retail design. Her love for her work and the added passion
                  and commitment, has landed her on Radio, Television and Print
                  media. Notable amongst these is a feature by the Business and
                  Financial Times and Multiple slots on “My Space with Lisa” an
                  interior décor show on GhOne TV. Growing up in the buzzing
                  city of Accra, Crystal loved the interiors of hotels, the high
                  ceilings, the wood paneled interiors, the heavily carpeted
                  floors, in short; the class and plushness of it all and always
                  wondered what it would be like to have everyone live like this
                  every single day and not only when they visited a fancy place.
                  She grew up on popular TV shows like “Extreme Makeover” and
                  “Clean House’, and enjoyed watching how Niecy Nash would
                  sashay her way into a family’s life and transform their space
                  (and inevitably their lives) with just a fresh lick of paint
                  and some furniture, she hoped to be like her one day… Today
                  she’s living that dream and is poised and ready to grow and
                  take on more monumental projects within the African Real
                  estate Landscape. When not busy completing projects, Crystal
                  can be found ensconced in nature, contemplating its beauty,
                  cooking or eating out with friends and family, or satisfying
                  her wanderlust by day dreaming of her next vacation
                  destination.
                </p>

                {/* <!-- <div data-reveal>
                <a href="about.html" class="btn btn-primary">Read More</a>
              </div> --> */}
              </div>

              <figure className="about-banner reveal-right">
                <img
                  src="/images/photo1673194826.jpeg"
                  width="686"
                  height="544"
                  loading="lazy"
                  alt="Crystal Selorm Amudzi "
                  className="w-100"
                />
              </figure>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}

export default Meettheteam;
