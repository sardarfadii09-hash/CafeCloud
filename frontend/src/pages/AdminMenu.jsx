
import { useEffect, useState } from 'react'
import {
  Link,
  Plus,
  Search,
  Pencil,
  Trash2,
  ArrowLeft,
  X
} from 'lucide-react'

const API = 'http://localhost:5000/api/menu'

const categories = ['All', 'Coffee', 'Cold Drinks', 'Food', 'Desserts']

const emptyForm = {
  name: '',
  category: 'Coffee',
  price: '',
  description: '',
  image: ''
}

const getToken = () =>
  localStorage.getItem('cafecloud-admin-token') ||
  localStorage.getItem('adminToken') ||
  localStorage.getItem('token') ||
  sessionStorage.getItem('cafecloud-admin-token') ||
  sessionStorage.getItem('adminToken') ||
  sessionStorage.getItem('token')

function AdminMenu() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const token = getToken()

  const request = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers
      }
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(data.message || `Request failed (${response.status})`)
    }

    return data
  }

  const loadItems = async () => {
    setLoading(true)
    setError('')

    try {
      if (!token) {
        throw new Error('Admin token nahi mila. Dobara Admin Login karo.')
      }

      const data = await request(`${API}/admin`)
      setItems(data.items || [])
    } catch (err) {
      setError(err.message || 'Menu load nahi ho saka.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
    // Load menu when this page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredItems = items.filter((item) => {
    const categoryMatch =
      category === 'All' || item.category === category

    const searchMatch = (item.name || '')
      .toLowerCase()
      .includes(search.toLowerCase())

    return categoryMatch && searchMatch
  })

  const openAddForm = () => {
    setEditingItem(null)
    setForm(emptyForm)
    setShowForm(true)
    setError('')
    setNotice('')
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setForm({
      name: item.name || '',
      category: item.category || 'Coffee',
      price: String(item.price ?? ''),
      description: item.description || '',
      image: item.image || ''
    })
    setShowForm(true)
    setError('')
    setNotice('')
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingItem(null)
    setForm(emptyForm)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setError('')
    setNotice('')

    if (!form.name.trim() || !form.category || form.price === '') {
      setError('Name, category aur price bharna zaroori hai.')
      return
    }

    const price = Number(form.price)

    if (!Number.isFinite(price) || price < 0) {
      setError('Price sahi number mein likho.')
      return
    }

    setSaving(true)

    const payload = {
      name: form.name.trim(),
      category: form.category,
      price,
      description: form.description.trim(),
      image: form.image.trim(),
      available: true
    }

    try {
      if (editingItem) {
        const id = editingItem._id || editingItem.id

        await request(`${API}/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        })

        setNotice('Menu item update ho gaya.')
      } else {
        await request(API, {
          method: 'POST',
          body: JSON.stringify(payload)
        })

        setNotice('Naya menu item database mein save ho gaya.')
      }

      closeForm()
      await loadItems()
    } catch (err) {
      setError(err.message || 'Menu item save nahi ho saka.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (item) => {
    const id = item._id || item.id

    if (!window.confirm(`Kya "${item.name}" ko delete karna hai?`)) {
      return
    }

    setError('')
    setNotice('')

    try {
      await request(`${API}/${id}`, { method: 'DELETE' })
      setNotice('Menu item delete ho gaya.')
      await loadItems()
    } catch (err) {
      setError(err.message || 'Menu item delete nahi ho saka.')
    }
  }

  return (
    <div className="admin-menu-page">
      <header className="admin-menu-header">
        <div className="admin-menu-header-inner">
          <div>
            <Link to="/admin-dashboard" className="admin-back-link">
              <ArrowLeft size={18} />
              Back to Dashboard
            </Link>

            <h1>Menu Management</h1>
            <p>Manage your CafeCloud menu items.</p>
          </div>

          <button
            type="button"
            className="admin-add-btn"
            onClick={openAddForm}
          >
            <Plus size={18} />
            Add Menu Item
          </button>
        </div>
      </header>

      <main className="admin-menu-main">
        {error && (
          <div role="alert" style={{ padding: 12, marginBottom: 16, color: '#a12622' }}>
            {error}
          </div>
        )}

        {notice && (
          <div role="status" style={{ padding: 12, marginBottom: 16 }}>
            {notice}
          </div>
        )}

        {showForm && (
          <form className="admin-edit-panel" onSubmit={handleSave}>
            <div className="admin-edit-header">
              <div>
                <span className="section-label">
                  {editingItem ? 'EDIT ITEM' : 'NEW MENU ITEM'}
                </span>
                <h2>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
              </div>

              <button
                type="button"
                className="admin-edit-close"
                onClick={closeForm}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-edit-form">
              <div className="admin-form-group">
                <label htmlFor="menu-name">Item Name</label>
                <input
                  id="menu-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Caramel Macchiato"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="menu-category">Category</label>
                <select
                  id="menu-category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  {categories.filter((item) => item !== 'All').map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label htmlFor="menu-price">Price (Rs.)</label>
                <input
                  id="menu-price"
                  name="price"
                  type="number"
                  min="0"
                  step="1"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="e.g. 450"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="menu-image">Image URL</label>
                <input
                  id="menu-image"
                  name="image"
                  type="url"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <div className="admin-form-group admin-form-full">
                <label htmlFor="menu-description">Description</label>
                <textarea
                  id="menu-description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Write a short description..."
                  rows="4"
                />
              </div>
            </div>

            <div className="admin-edit-actions">
              <button
                type="button"
                className="admin-edit-cancel"
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="admin-edit-save"
                disabled={saving}
              >
                {saving ? 'Saving...' : editingItem ? 'Save Changes' : 'Add Menu Item'}
              </button>
            </div>
          </form>
        )}

        <div className="admin-menu-toolbar">
          <div className="admin-menu-search">
            <Search size={19} />
            <input
              type="text"
              placeholder="Search menu items..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="admin-menu-filters">
            {categories.map((itemCategory) => (
              <button
                key={itemCategory}
                type="button"
                className={
                  category === itemCategory
                    ? 'admin-filter-btn active'
                    : 'admin-filter-btn'
                }
                onClick={() => setCategory(itemCategory)}
              >
                {itemCategory}
              </button>
            ))}
          </div>
        </div>

        <div className="admin-menu-summary">
          <div>
            <strong>{filteredItems.length}</strong>
            <span>Showing Items</span>
          </div>

          <div>
            <strong>{items.length}</strong>
            <span>Admin Items</span>
          </div>

          <div>
            <strong>{categories.length - 1}</strong>
            <span>Categories</span>
          </div>
        </div>

        <div className="admin-menu-table-wrapper">
          {loading ? (
            <div className="admin-menu-empty">
              <p>MongoDB se menu load ho raha hai...</p>
            </div>
          ) : (
            <>
              <table className="admin-menu-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item._id || item.id}>
                      <td>
                        <div className="admin-item-info">
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=300&q=80'}
                            alt={item.name}
                          />
                          <div>
                            <strong>{item.name}</strong>
                            <span>{item.description}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="admin-category">{item.category}</span>
                      </td>

                      <td>
                        <strong>Rs. {item.price}</strong>
                      </td>

                      <td>
                        <span className="admin-status">
                          {item.available === false ? 'Unavailable' : 'Active'}
                        </span>
                      </td>

                      <td>
                        <div className="admin-actions">
                          <button
                            type="button"
                            className="admin-action edit"
                            title="Edit"
                            aria-label={`Edit ${item.name}`}
                            onClick={() => handleEdit(item)}
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            className="admin-action delete"
                            title="Delete"
                            aria-label={`Delete ${item.name}`}
                            onClick={() => handleDelete(item)}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredItems.length === 0 && (
                <div className="admin-menu-empty">
                  <h3>No menu items found</h3>
                  <p>
                    {items.length === 0
                      ? 'Database mein abhi menu items nahi hain. Add Menu Item se shuru karo.'
                      : 'Try another search or category.'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminMenu