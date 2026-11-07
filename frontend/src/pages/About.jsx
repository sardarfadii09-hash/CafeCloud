import Navbar from '../components/Navbar'
import {
  Coffee,
  Heart,
  Users,
  Sparkles
} from 'lucide-react'

function About() {
  return (
    <>
      <Navbar />

      <main className="about-page">

        {/* HERO */}
        <section className="about-hero">
          <div className="about-hero-overlay"></div>

          <div className="container about-hero-content">
            <span>ABOUT CAFECLOUD</span>

            <h1>
              Coffee, Comfort
              <br />
              & Good Moments.
            </h1>

            <p>
              A place where great coffee, delicious food
              and meaningful moments come together.
            </p>
          </div>
        </section>

        {/* STORY */}
        <section className="about-story section">
          <div className="container about-story-grid">

            <div className="about-story-image">
              <img
                src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1000&q=85"
                alt="CafeCloud coffee shop"
              />
            </div>

            <div className="about-story-content">
              <span className="section-label">
                OUR STORY
              </span>

              <h2 className="section-title">
                More Than Just
                <br />
                A Coffee Shop.
              </h2>

              <p>
                CafeCloud was created with one simple idea:
                coffee tastes better when it is enjoyed in
                the right atmosphere.
              </p>

              <p>
                From carefully prepared coffee to fresh food
                and sweet desserts, every detail is designed
                to make your visit comfortable, enjoyable and
                memorable.
              </p>

              <div className="about-signature">
                <span>☕</span>

                <div>
                  <strong>CafeCloud</strong>
                  <small>Made for good moments.</small>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* STATS */}
        <section className="about-stats">
          <div className="container about-stats-grid">

            <div className="about-stat">
              <strong>24+</strong>
              <span>Menu Favorites</span>
            </div>

            <div className="about-stat">
              <strong>100%</strong>
              <span>Fresh Ingredients</span>
            </div>

            <div className="about-stat">
              <strong>7 Days</strong>
              <span>Open Every Week</span>
            </div>

            <div className="about-stat">
              <strong>1 Goal</strong>
              <span>Happy Customers</span>
            </div>

          </div>
        </section>

        {/* VALUES */}
        <section className="about-values section">
          <div className="container">

            <div className="section-header">
              <span className="section-label">
                WHAT WE BELIEVE
              </span>

              <h2 className="section-title">
                What Makes CafeCloud Special
              </h2>

              <p className="section-text">
                We focus on the little things that turn
                an ordinary visit into a memorable one.
              </p>
            </div>

            <div className="about-values-grid">

              {/* GREAT COFFEE */}
              <div className="about-value-card">

                <div className="about-value-image">
                  <img
                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85"
                    alt="Fresh coffee"
                  />

                  <div className="about-value-icon">
                    <Coffee size={22} />
                  </div>
                </div>

                <div className="about-value-content">
                  <span>01</span>

                  <h3>Great Coffee</h3>

                  <p>
                    Carefully prepared coffee using quality
                    beans and thoughtful brewing.
                  </p>
                </div>

              </div>

              {/* MADE WITH CARE */}
              <div className="about-value-card">

                <div className="about-value-image">
                  <img
                    src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=85"
                    alt="Coffee preparation"
                  />

                  <div className="about-value-icon">
                    <Heart size={22} />
                  </div>
                </div>

                <div className="about-value-content">
                  <span>02</span>

                  <h3>Made With Care</h3>

                  <p>
                    Every drink and dish is prepared with
                    attention to taste and quality.
                  </p>
                </div>

              </div>

              {/* WARM ATMOSPHERE */}
              <div className="about-value-card">

                <div className="about-value-image">
                  <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=85"
                    alt="Warm cafe atmosphere"
                  />

                  <div className="about-value-icon">
                    <Users size={22} />
                  </div>
                </div>

                <div className="about-value-content">
                  <span>03</span>

                  <h3>Warm Atmosphere</h3>

                  <p>
                    A comfortable space where friends,
                    families and coffee lovers feel welcome.
                  </p>
                </div>

              </div>

              {/* GOOD MOMENTS */}
              <div className="about-value-card">

                <div className="about-value-image">
                  <img
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=85"
                    alt="Friends enjoying good moments"
                  />

                  <div className="about-value-icon">
                    <Sparkles size={22} />
                  </div>
                </div>

                <div className="about-value-content">
                  <span>04</span>

                  <h3>Good Moments</h3>

                  <p>
                    Because the best café experiences are
                    about more than just what is on the table.
                  </p>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* CTA */}
        <section className="about-cta">
          <div className="about-cta-overlay"></div>

          <div className="container about-cta-content">
            <span>YOUR NEXT MOMENT STARTS HERE</span>

            <h2>
              Come For The Coffee.
              <br />
              Stay For The Moments.
            </h2>

            <a
              href="/menu"
              className="btn btn-light"
            >
              Explore Our Menu
            </a>
          </div>
        </section>

      </main>
    </>
  )
}

export default About