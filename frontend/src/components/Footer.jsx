
import { Link } from 'react-router-dom'
import {
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
  Coffee,
  Sparkles
} from 'lucide-react'

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-main">
        <div className="container footer-grid">

          {/* BRAND */}
          <div className="footer-brand">

            <Link to="/" className="footer-logo">
              <span>☕</span>
              CafeCloud
            </Link>

            <p>
              Fresh coffee, delicious food and good moments.
              A cozy place made for conversations, connections
              and memorable experiences.
            </p>

            <div className="footer-socials">
              <a href="#" aria-label="Instagram">◎</a>
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="Twitter">𝕏</a>
            </div>

          </div>

          {/* QUICK LINKS */}
          <div className="footer-column">

            <h3>Quick Links</h3>

            <Link to="/">
              Home
              <ArrowUpRight size={14} />
            </Link>

            <Link to="/menu">
              Our Menu
              <ArrowUpRight size={14} />
            </Link>

            <Link to="/reservation">
              Reservation
              <ArrowUpRight size={14} />
            </Link>

            <Link to="/about">
              About Us
              <ArrowUpRight size={14} />
            </Link>

            <Link to="/contact">
              Contact
              <ArrowUpRight size={14} />
            </Link>

          </div>

          {/* CONTACT */}
          <div className="footer-column">

            <h3>Contact Us</h3>

            <div className="footer-contact">

              <div>
                <MapPin size={17} />
                <span>Abbottabad, the Heart of Hazara</span>
              </div>

              <div>
                <Phone size={17} />
                <span>03375657896</span>
              </div>

              <div>
                <Mail size={17} />
                <span>hello@cafecloud.com</span>
              </div>

            </div>

          </div>

          {/* OPENING HOURS */}
          <div className="footer-column">

            <h3>Opening Hours</h3>

            <div className="footer-hours">

              <div>
                <span>Every Day</span>
                <strong>10:00 AM — 3:00 AM</strong>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* PREMIUM BOTTOM BAR */}
      <div className="footer-bottom">

        <div className="container footer-bottom-inner">

          <p>
            © 2026 CafeCloud. All Rights Reserved.
          </p>

          {/* CREATOR SIGNATURE */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '9px 17px 9px 10px',
              border: '1px solid rgba(190, 145, 99, 0.45)',
              borderRadius: '50px',
              background: 'linear-gradient(135deg, rgba(111, 78, 55, 0.35), rgba(36, 22, 15, 0.9))',
              boxShadow: '0 4px 18px rgba(0, 0, 0, 0.18)',
              color: '#e7c49c'
            }}
          >
            <span
              style={{
                width: '37px',
                height: '37px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(145deg, #b78b60, #6f4e37)',
                color: '#fff8ef',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              <Coffee size={20} />
            </span>

            <span
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}
            >
              <span
                style={{
                  fontSize: '9px',
                  letterSpacing: '2px',
                  color: '#c7a47e'
                }}
              >
                CRAFTED WITH PASSION
              </span>

              <span
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '15px',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  color: '#f5dfc4'
                }}
              >
                Created by Fahad..
              </span>
            </span>

            <Sparkles size={16} color="#c99c6b" />

          </div>

        </div>

      </div>

    </footer>
  )
}

export default Footer
