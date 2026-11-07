import { Link } from 'react-router-dom'
import {
  MapPin,
  Phone,
  Mail,
  ArrowUpRight
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
                <span>
                  Main Boulevard,
                  <br />
                  Abbottabad
                </span>
              </div>

              <div>
                <Phone size={17} />
                <span>+92 300 1234567</span>
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
                <span>Monday — Friday</span>
                <strong>10:00 AM — 11:00 PM</strong>
              </div>

              <div>
                <span>Saturday</span>
                <strong>10:00 AM — 12:00 AM</strong>
              </div>

              <div>
                <span>Sunday</span>
                <strong>11:00 AM — 11:00 PM</strong>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">

        <div className="container footer-bottom-inner">

          <p>
            © 2026 CafeCloud. All rights reserved.
          </p>

          <span>
            Crafted with ☕ &amp; passion.
          </span>

        </div>

      </div>

    </footer>
  )
}

export default Footer