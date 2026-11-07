
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Coffee,
  User,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'

import Navbar from '../components/Navbar'

function Cart() {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cafecloud-cart')
      return savedCart ? JSON.parse(savedCart) : []
    } catch {
      return []
    }
  })

  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState({
    type: '',
    message: ''
  })

  const [customer, setCustomer] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: ''
  })

  useEffect(() => {
    localStorage.setItem('cafecloud-cart', JSON.stringify(cart))
  }, [cart])

  const handleCustomerChange = (e) => {
    const { name, value } = e.target

    setCustomer((previous) => ({
      ...previous,
      [name]: value
    }))
  }

  const updateQuantity = (id, change) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(
                1,
                (item.quantity || 1) + change
              )
            }
          : item
      )
    )
  }

  const removeItem = (id) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.quantity || 1),
    0
  )

  const totalItems = cart.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 1),
    0
  )

  const handleCheckout = async (e) => {
    e.preventDefault()

    if (cart.length === 0) {
      setFeedback({
        type: 'error',
        message: 'Your cart is empty.'
      })
      return
    }

    setLoading(true)
    setFeedback({ type: '', message: '' })

    try {
      const orderItems = cart.map((item) => ({
        menuItemId: item.id,
        quantity: Number(item.quantity || 1)
      }))

      const response = await fetch(
        'http://localhost:5000/api/orders',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            customerName: customer.customerName,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            items: orderItems
          })
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Your order could not be placed.'
        )
      }

      setFeedback({
        type: 'success',
        message: 'Your order has been placed successfully!'
      })

      setCart([])
      setCustomer({
        customerName: '',
        email: '',
        phone: '',
        address: ''
      })
      setCheckoutOpen(false)
    } catch (error) {
      setFeedback({
        type: 'error',
        message:
          error.message ||
          'Unable to connect to the server. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />

      <main className="cart-page">

        <section className="cart-hero">
          <div className="cart-hero-overlay">
            <div className="container cart-hero-content">

              <div className="cart-hero-badge">
                <Coffee size={16} />
                CAFECLOUD
              </div>

              <span className="section-label">
                YOUR ORDER
              </span>

              <h1>
                Your Coffee,
                <br />
                <span>Your Moment.</span>
              </h1>

              <p>
                Everything you've selected, gathered in one place.
              </p>

            </div>
          </div>
        </section>

        <section className="section cart-section">
          <div className="container">

            {feedback.message && (
              <p
                role="status"
                style={{
                  padding: '14px',
                  marginBottom: '20px',
                  borderRadius: '8px',
                  background:
                    feedback.type === 'success' ? '#e8f5e9' : '#ffebee',
                  color:
                    feedback.type === 'success' ? '#256029' : '#b71c1c'
                }}
              >
                {feedback.message}
              </p>
            )}

            {cart.length === 0 ? (

              <div className="cart-empty">

                <div className="cart-empty-icon">
                  <ShoppingBag size={36} />
                </div>

                <span className="section-label">
                  {feedback.type === 'success'
                    ? 'ORDER COMPLETED'
                    : 'NOTHING HERE YET'}
                </span>

                <h2>
                  {feedback.type === 'success'
                    ? 'Thank you for your order!'
                    : 'Your cart is waiting'}
                </h2>

                <p>
                  {feedback.type === 'success'
                    ? 'Your order has been received by CafeCloud.'
                    : 'Explore our menu and discover something delicious.'}
                </p>

                <Link
                  to="/menu"
                  className="btn btn-primary cart-empty-button"
                >
                  Explore Menu
                  <ArrowRight size={18} />
                </Link>

              </div>

            ) : (

              <div className="cart-layout">

                <div className="cart-items-card">

                  <div className="cart-card-header">

                    <div>
                      <span className="section-label">
                        YOUR SELECTION
                      </span>

                      <h2>Selected Items</h2>

                      <p>
                        {totalItems} item
                        {totalItems !== 1 ? 's' : ''} in your cart
                      </p>
                    </div>

                    <button
                      type="button"
                      className="cart-clear-button"
                      onClick={clearCart}
                    >
                      <Trash2 size={15} />
                      Clear Cart
                    </button>

                  </div>

                  <div className="cart-items">

                    {cart.map((item) => (

                      <article
                        className="cart-item"
                        key={item.id}
                      >

                        <div className="cart-item-image">
                          <img
                            src={item.image}
                            alt={item.name}
                          />
                          <span>{item.category}</span>
                        </div>

                        <div className="cart-item-info">
                          <span className="cart-item-category">
                            {item.category}
                          </span>

                          <h3>{item.name}</h3>

                          <p>
                            Freshly prepared with CafeCloud's
                            signature touch.
                          </p>

                          <strong>Rs. {item.price}</strong>
                        </div>

                        <div className="cart-item-controls">

                          <div className="cart-quantity">

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, -1)
                              }
                              aria-label="Decrease quantity"
                            >
                              <Minus size={15} />
                            </button>

                            <span>{item.quantity || 1}</span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, 1)
                              }
                              aria-label="Increase quantity"
                            >
                              <Plus size={15} />
                            </button>

                          </div>

                          <button
                            type="button"
                            className="cart-remove"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>

                      </article>

                    ))}

                  </div>

                  <Link to="/menu" className="cart-continue">
                    <ArrowLeft size={17} />
                    Continue Shopping
                  </Link>

                </div>

                <aside className="cart-summary">

                  <div className="cart-summary-top">

                    <span className="section-label">
                      ORDER SUMMARY
                    </span>

                    <h2>Your Checkout</h2>

                    <p>
                      A little something good is on its way.
                    </p>

                  </div>

                  <div className="cart-summary-details">

                    <div className="cart-summary-row">
                      <span>Items</span>
                      <strong>{totalItems}</strong>
                    </div>

                    <div className="cart-summary-row">
                      <span>Subtotal</span>
                      <strong>Rs. {total}</strong>
                    </div>

                    <div className="cart-summary-row">
                      <span>Delivery</span>
                      <strong className="delivery-text">
                        At checkout
                      </strong>
                    </div>

                  </div>

                  <div className="cart-summary-total">
                    <div>
                      <span>Total</span>
                      <small>PKR</small>
                    </div>

                    <strong>Rs. {total}</strong>
                  </div>

                  {!checkoutOpen ? (

                    <button
                      type="button"
                      className="cart-checkout-button"
                      onClick={() => {
                        setFeedback({ type: '', message: '' })
                        setCheckoutOpen(true)
                      }}
                    >
                      Proceed to Checkout
                      <ArrowRight size={18} />
                    </button>

                  ) : (

                    <form
                      onSubmit={handleCheckout}
                      style={{
                        marginTop: '20px',
                        display: 'grid',
                        gap: '14px'
                      }}
                    >

                      <h3>Customer Details</h3>

                      <div className="form-group">
                        <label>
                          <User size={16} />
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="customerName"
                          value={customer.customerName}
                          onChange={handleCustomerChange}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          <Mail size={16} />
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={customer.email}
                          onChange={handleCustomerChange}
                          placeholder="Enter your email"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          <Phone size={16} />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={customer.phone}
                          onChange={handleCustomerChange}
                          placeholder="03XX XXXXXXX"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          <MapPin size={16} />
                          Address (Optional)
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={customer.address}
                          onChange={handleCustomerChange}
                          placeholder="Enter your address"
                        />
                      </div>

                      <button
                        type="submit"
                        className="cart-checkout-button"
                        disabled={loading}
                      >
                        {loading ? 'Placing Order...' : 'Place My Order'}
                        <ArrowRight size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setCheckoutOpen(false)}
                        disabled={loading}
                        style={{
                          padding: '12px',
                          cursor: 'pointer',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          background: 'transparent'
                        }}
                      >
                        Back to Cart
                      </button>

                    </form>

                  )}

                  <div className="cart-secure">
                    <ShieldCheck size={18} />

                    <div>
                      <strong>Secure & Simple</strong>
                      <span>
                        Your order details are kept safe.
                      </span>
                    </div>
                  </div>

                </aside>

              </div>

            )}

          </div>
        </section>

      </main>
    </>
  )
}

export default Cart
