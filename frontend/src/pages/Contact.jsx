
import { useState } from 'react'
import Navbar from '../components/Navbar'
import {
  Phone,
  Mail,
  MapPin,
  Clock3,
  Send
} from 'lucide-react'

function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const form = e.currentTarget

    const formData = new FormData(form)

    const messageData = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    }

    try {
      setIsSubmitting(true)

      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Message could not be sent.')
      }

      alert('Your message has been sent successfully!')
      form.reset()

    } catch (error) {
      alert(error.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />

      <main className="contact-page">

        <section className="contact-hero">
          <div className="contact-hero-overlay"></div>

          <div className="container contact-hero-content">
            <span>GET IN TOUCH</span>

            <h1>
              We'd Love To
              <br />
              Hear From You.
            </h1>

            <p>
              Have a question, suggestion or just want to
              say hello? Our team is always happy to hear from you.
            </p>
          </div>
        </section>

        <section className="contact-section section">
          <div className="container">

            <div className="contact-grid">

              <div className="contact-info">

                <span className="section-label">
                  CONTACT CAFECLOUD
                </span>

                <h2 className="section-title">
                  Let's Start
                  <br />
                  A Conversation.
                </h2>

                <p className="contact-intro">
                  Whether you want to ask about our menu,
                  reserve a table or simply share your experience,
                  feel free to reach out.
                </p>

                <div className="contact-details">

                  <div className="contact-detail">
                    <div className="contact-detail-icon">
                      <Phone size={20} />
                    </div>

                    <div>
                      <span>Call Us</span>
                      <strong>+92 300 1234567</strong>
                    </div>
                  </div>

                  <div className="contact-detail">
                    <div className="contact-detail-icon">
                      <Mail size={20} />
                    </div>

                    <div>
                      <span>Email Us</span>
                      <strong>hello@cafecloud.com</strong>
                    </div>
                  </div>

                  <div className="contact-detail">
                    <div className="contact-detail-icon">
                      <MapPin size={20} />
                    </div>

                    <div>
                      <span>Visit Us</span>
                      <strong>Main Boulevard, Abbottabad</strong>
                    </div>
                  </div>

                  <div className="contact-detail">
                    <div className="contact-detail-icon">
                      <Clock3 size={20} />
                    </div>

                    <div>
                      <span>Opening Hours</span>
                      <strong>10:00 AM — 11:00 PM</strong>
                    </div>
                  </div>

                </div>

              </div>

              <div className="contact-form-card">

                <div className="contact-form-heading">
                  <span className="section-label">
                    SEND A MESSAGE
                  </span>

                  <h3>
                    How Can We Help?
                  </h3>

                  <p>
                    Fill out the form and we'll get back to you.
                  </p>
                </div>

                <form onSubmit={handleSubmit}>

                  <div className="contact-form-row">

                    <div className="contact-form-group">
                      <label>Your Name</label>

                      <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        required
                      />
                    </div>

                    <div className="contact-form-group">
                      <label>Email Address</label>

                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                  </div>

                  <div className="contact-form-group">
                    <label>Subject</label>

                    <input
                      type="text"
                      name="subject"
                      placeholder="What is this about?"
                      required
                    />
                  </div>

                  <div className="contact-form-group">
                    <label>Your Message</label>

                    <textarea
                      name="message"
                      rows="6"
                      placeholder="Write your message here..."
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="contact-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    <Send size={18} />
                  </button>

                </form>

              </div>

            </div>

          </div>
        </section>

        <section className="contact-showcase">
          <div className="contact-showcase-overlay"></div>

          <div className="container contact-showcase-content">
            <span>COME VISIT US</span>

            <h2>
              Your Favorite Coffee
              <br />
              Is Waiting.
            </h2>

            <p>
              Good coffee, great food and even better company.
            </p>
          </div>
        </section>

      </main>
    </>
  )
}

export default Contact
