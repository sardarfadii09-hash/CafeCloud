import Navbar from '../components/Navbar'
import { Coffee, UtensilsCrossed, Heart } from 'lucide-react'

function Home() {
  return (
    <>
      <Navbar />

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="hero-overlay"></div>

          <div className="container hero-content">
            <span className="hero-label">WELCOME TO CAFECLOUD</span>

            <h1>
              Where Every Cup
              <span>Tells a Story.</span>
            </h1>

            <p>
              Freshly brewed coffee, delicious food, and a cozy place
              made for your best moments.
            </p>

            <div className="hero-buttons">
              <a href="/menu" className="btn btn-primary">
                Explore Menu
              </a>

              <a href="/reservation" className="btn btn-light">
                Book a Table
              </a>
            </div>
          </div>
        </section>
{/* FEATURES */}
<section className="features section">
  <div className="container">

    <div className="section-header">
      <span className="section-label">WHY CAFECLOUD</span>

      <h2 className="section-title">
        More Than Just Coffee
      </h2>

      <p className="section-text">
        Every visit is crafted to give you great taste,
        comfort, and memorable moments.
      </p>
    </div>

    <div className="features-grid">

      <div className="feature-card">
        <div className="feature-image">
          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85"
            alt="Fresh Coffee"
          />
        </div>

        <div className="feature-content">
          <span className="feature-number">01</span>
          <h3>Fresh Coffee</h3>
          <p>
            Freshly roasted beans and carefully brewed coffee
            for a rich and unforgettable taste.
          </p>
        </div>
      </div>

      <div className="feature-card">
        <div className="feature-image">
          <img
            src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85"
            alt="Delicious Food"
          />
        </div>

        <div className="feature-content">
          <span className="feature-number">02</span>
          <h3>Delicious Food</h3>
          <p>
            Freshly prepared snacks, desserts and meals
            made with quality ingredients.
          </p>
        </div>
      </div>

      <div className="feature-card">
        <div className="feature-image">
          <img
            src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=85"
            alt="Good Moments"
          />
        </div>

        <div className="feature-content">
          <span className="feature-number">03</span>
          <h3>Good Moments</h3>
          <p>
            A warm and comfortable space for conversations,
            friends and unforgettable moments.
          </p>
        </div>
      </div>

    </div>

  </div>
</section>
      </main>
    </>
  )
}

export default Home