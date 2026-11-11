
import { useEffect, useState } from 'react'
import { Search, ShoppingBag } from 'lucide-react'
import Navbar from '../components/Navbar'
import API_BASE_URL from '../services/api'

function Menu() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const categories = ['All', 'Coffee', 'Cold Drinks', 'Food', 'Desserts']

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(`${API_BASE_URL}/api/menu`)
        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Unable to load menu.')
        }

        const formattedItems = data.items
          .filter((item) => item.name !== 'TEST')
          .map((item) => ({
            ...item,
            id: item._id
          }))

        setMenuItems(formattedItems)
      } catch (err) {
        setError(err.message || 'Something went wrong while loading the menu.')
      } finally {
        setLoading(false)
      }
    }

    fetchMenu()
  }, [])

  const filteredItems = menuItems.filter((item) => {
    const categoryMatch =
      selectedCategory === 'All' ||
      item.category === selectedCategory

    const searchMatch =
      item.name.toLowerCase().includes(search.toLowerCase())

    return categoryMatch && searchMatch
  })

  const addToCart = (item) => {
    let cart = []

    try {
      cart = JSON.parse(localStorage.getItem('cafecloud-cart')) || []
    } catch {
      cart = []
    }

    const hasOldItems = cart.some(
      (cartItem) => !/^[a-f0-9]{24}$/i.test(String(cartItem.id))
    )

    if (hasOldItems) {
      alert('Your cart contains old items. Please clear your cart first, then add products again.')
      return
    }

    const existingItem = cart.find(
      (cartItem) => cartItem.id === item.id
    )

    let updatedCart

    if (existingItem) {
      updatedCart = cart.map((cartItem) =>
        cartItem.id === item.id
          ? {
              ...cartItem,
              quantity: Number(cartItem.quantity || 1) + 1
            }
          : cartItem
      )
    } else {
      updatedCart = [
        ...cart,
        {
          ...item,
          quantity: 1
        }
      ]
    }

    localStorage.setItem(
      'cafecloud-cart',
      JSON.stringify(updatedCart)
    )

    window.dispatchEvent(new Event('cartUpdated'))

    alert(`${item.name} added to cart!`)
  }

  return (
    <>
      <Navbar />

      <main className="menu-page">
        <section className="menu-hero">
          <div className="menu-hero-content container">
            <span className="section-label">OUR MENU</span>

            <h1>
              Delicious
              <br />
              <span>Moments.</span>
            </h1>

            <p>
              Discover freshly brewed coffee, refreshing drinks,
              delicious food and sweet treats.
            </p>
          </div>
        </section>

        <section className="section menu-section">
          <div className="container">

            <div className="section-header">
              <span className="section-label">CAFECLOUD</span>

              <h2 className="section-title">
                Our Delicious Menu
              </h2>

              <p className="section-text">
                Something delicious for every mood and every moment.
              </p>
            </div>

            <div className="menu-toolbar">
              <div className="menu-search">
                <Search size={20} />

                <input
                  type="text"
                  placeholder="Search menu..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="menu-categories">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={
                      selectedCategory === category
                        ? 'category-btn active'
                        : 'category-btn'
                    }
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {loading && (
              <div className="menu-empty">
                <h3>Loading menu...</h3>
                <p>Please wait while we fetch our delicious menu.</p>
              </div>
            )}

            {!loading && error && (
              <div className="menu-empty">
                <h3>Unable to load menu</h3>
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && (
              <>
                <div className="menu-grid">
                  {filteredItems.map((item) => (
                    <div
                      className="menu-card card"
                      key={item.id}
                    >
                      <div className="menu-card-image">
                        <img
                          src={item.image}
                          alt={item.name}
                        />

                        <span className="menu-card-category">
                          {item.category}
                        </span>
                      </div>

                      <div className="menu-card-content">
                        <div className="menu-card-top">
                          <h3>{item.name}</h3>

                          <span className="menu-price">
                            Rs. {item.price}
                          </span>
                        </div>

                        <p>{item.description}</p>

                        <button
                          type="button"
                          className="btn btn-primary menu-add-btn"
                          onClick={() => addToCart(item)}
                        >
                          <ShoppingBag size={18} />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredItems.length === 0 && (
                  <div className="menu-empty">
                    <h3>No menu items found</h3>
                    <p>
                      Try searching for something else.
                    </p>
                  </div>
                )}
              </>
            )}

          </div>
        </section>
      </main>
    </>
  )
}

export default Menu
