import { useMemo, useState } from 'react'
import './App.css'

const products = [
  { id: 1, name: 'Cloud Knit Sweater', category: 'Clothing', price: 1800, rating: 4.9, reviews: 124, color: 'Oatmeal', badge: 'Bestseller', image: 'photo-1576566588028-4147f3842f27' },
  { id: 2, name: 'Everyday Leather Tote', category: 'Accessories', price: 2500, rating: 4.8, reviews: 86, color: 'Chestnut', badge: 'Almost gone', image: 'photo-1548036328-c9fa89d128fa' },
  { id: 3, name: 'Sculpted Ceramic Vase', category: 'Home', price: 1200, rating: 4.9, reviews: 52, color: 'Warm white', badge: '', image: 'photo-1578500494198-246f612d3b3d' },
  { id: 4, name: 'Weekend Runner', category: 'Shoes', price: 2200, rating: 4.7, reviews: 91, color: 'Stone / Sage', badge: 'New arrival', image: 'photo-1542291026-7eec264c27ff' },
  { id: 5, name: 'Ribbed Lounge Set', category: 'Clothing', price: 2000, rating: 4.8, reviews: 73, color: 'Moss', badge: '', image: 'photo-1551488831-00ddcb6c6bd3' },
  { id: 6, name: 'Soft Form Crossbody', category: 'Accessories', price: 1600, rating: 4.9, reviews: 108, color: 'Espresso', badge: '', image: 'photo-1584917865442-de89df76afd3' },
  { id: 7, name: 'Sunday Ceramic Set', category: 'Home', price: 1400, rating: 4.8, reviews: 39, color: 'Sand', badge: 'Made by hand', image: 'photo-1493106641515-6b5631de4bb9' },
  { id: 8, name: 'Coastline Slide', category: 'Shoes', price: 1300, rating: 4.6, reviews: 61, color: 'Natural', badge: '', image: 'photo-1543163521-1bf539c55dd2' },
]

const categories = ['All', 'Clothing', 'Accessories', 'Home', 'Shoes']
const imageUrl = (id, width = 720) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`
const formatPrice = (amount) => `Tk ${amount.toLocaleString('en-BD')}`
const freeShippingThreshold = 2000
const currentYear = new Date().getFullYear()

function Icon({ name, size = 20 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const shapes = {
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4 4" /></>,
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 21a7 7 0 0 1 14 0" /></>,
    bag: <><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    heart: <path d="M20.8 8.7c0 5.2-8.8 10.1-8.8 10.1S3.2 13.9 3.2 8.7A4.6 4.6 0 0 1 12 6.4a4.6 4.6 0 0 1 8.8 2.3Z" />,
    arrow: <><path d="M4 12h15" /><path d="m13 5 7 7-7 7" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    minus: <path d="M5 12h14" />,
    check: <path d="m5 12 4 4L19 6" />,
    truck: <><path d="M3 6h11v12H3zM14 10h4l3 3v5h-7" /><circle cx="7.5" cy="18.5" r="1.5" /><circle cx="17.5" cy="18.5" r="1.5" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  }
  return <svg {...common}>{shapes[name]}</svg>
}

function App() {
  const [category, setCategory] = useState('All')
  const [priceRange, setPriceRange] = useState('all')
  const [minRating, setMinRating] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [modal, setModal] = useState('')
  const [toast, setToast] = useState('')
  const [user, setUser] = useState('')
  const [favorites, setFavorites] = useState(() => new Set())

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => (
      (category === 'All' || product.category === category)
      && product.name.toLowerCase().includes(query.trim().toLowerCase())
      && (priceRange === 'all'
        || (priceRange === 'under-1500' && product.price < 1500)
        || (priceRange === '1500-2000' && product.price >= 1500 && product.price <= 2000)
        || (priceRange === 'over-2000' && product.price > 2000))
      && (minRating === 'all' || product.rating >= Number(minRating))
    ))
    if (sortBy === 'price-low') return [...filtered].sort((a, b) => a.price - b.price)
    if (sortBy === 'price-high') return [...filtered].sort((a, b) => b.price - a.price)
    if (sortBy === 'rating') return [...filtered].sort((a, b) => b.rating - a.rating)
    return filtered
  }, [category, minRating, priceRange, query, sortBy])

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0)
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2400)
  }

  const addToCart = (product) => {
    setCart((items) => {
      const existing = items.find((item) => item.id === product.id)
      return existing
        ? items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...items, { ...product, quantity: 1 }]
    })
    notify(`${product.name} added to your bag`)
  }

  const updateQuantity = (id, amount) => {
    setCart((items) => items
      .map((item) => item.id === id ? { ...item, quantity: item.quantity + amount } : item)
      .filter((item) => item.quantity > 0))
  }

  const handleAccount = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = formData.get('name')?.toString().trim()
    setUser(name || formData.get('email')?.toString().split('@')[0] || 'Friend')
    setModal('')
    notify('You’re all set. Welcome to Devfolk.')
  }

  const placeOrder = (event) => {
    event.preventDefault()
    setCart([])
    setCartOpen(false)
    setModal('success')
  }

  return (
    <div className="storefront">
      <div className="announcement">
        <span className="announcement-detail">Complimentary shipping on orders over {formatPrice(freeShippingThreshold)} <span aria-hidden="true">→</span></span>
      </div>

      <header className="site-header">
        <a className="wordmark" href="#" aria-label="Devfolk home" onClick={() => { setCategory('All'); setQuery('') }}>Devfolk<span>.</span></a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#shop">Shop all</a>
          <a href="#shop" onClick={() => setCategory('Home')}>Home</a>
          <a href="#shop" onClick={() => setCategory('Clothing')}>Clothing</a>
          <a href="#our-story">Our story</a>
        </nav>
        <div className="header-actions">
          {searchOpen && (
            <label className="search-field">
              <span className="sr-only">Search products</span>
              <input autoFocus value={query} onChange={(event) => { setQuery(event.target.value); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }) }} placeholder="Search..." />
              <button type="button" aria-label="Close search" onClick={() => { setSearchOpen(false); setQuery('') }}><Icon name="close" size={17} /></button>
            </label>
          )}
          <button className="icon-button search-toggle" type="button" aria-label="Search" onClick={() => setSearchOpen((open) => !open)}><Icon name="search" /></button>
          <button className="icon-button account-button" type="button" aria-label={user ? `Account for ${user}` : 'Sign in'} onClick={() => setModal('account')}><Icon name="user" /><span className="account-label">{user || 'Account'}</span></button>
          <button className="icon-button bag-button" type="button" aria-label={`Shopping bag, ${itemCount} items`} onClick={() => setCartOpen(true)}><Icon name="bag" /><span className="bag-label">Bag</span><span className="bag-count">{itemCount}</span></button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-dot" /> A LITTLE MORE INTENTIONAL</span>
            <h1>Good things.<br /><em>Better days.</em></h1>
            <p>Everyday essentials with a softer footprint and a little more soul. Made for living in, not just looking at.</p>
            <a className="button button-dark" href="#shop">Find your everyday <Icon name="arrow" size={17} /></a>
            <div className="hero-note"><span className="note-stars">★★★★★</span><span>Loved by 12,000+ thoughtful shoppers</span></div>
          </div>
          <div className="hero-visual">
            <img src={imageUrl('photo-1490481651871-ab68de25d43d', 1400)} alt="A thoughtfully styled wardrobe of timeless everyday pieces" />
            <div className="hero-sticker"><span>made for</span><strong>everyday<br />living</strong><span>since 2018</span></div>
            <div className="hero-caption"><span>THE SLOW MORNING EDIT</span><span>01 / 04</span></div>
          </div>
          <span className="hero-side-note">GOOD DESIGN, GOOD FEELING, GOOD FOR THE LONG RUN</span>
        </section>

        <section className="benefit-row" aria-label="Our promises">
          <div><span className="benefit-icon">✳</span><span>Considered materials</span></div>
          <div><span className="benefit-icon">↗</span><span>Small-batch makers</span></div>
          <div><span className="benefit-icon">♡</span><span>Made to be kept</span></div>
          <div><span className="benefit-icon">⌂</span><span>Free shipping over {formatPrice(freeShippingThreshold)}</span></div>
        </section>

        <section className="shop-section" id="shop">
          <div className="section-heading">
            <div><span className="eyebrow">THE GOOD STUFF</span><h2>Everyday, <em>elevated.</em></h2></div>
            <a className="text-link" href="#our-story">A little about us <Icon name="arrow" size={16} /></a>
          </div>
          <div className="shop-toolbar">
            <div className="category-tabs" role="tablist" aria-label="Filter by category">
              {categories.map((item) => (
                <button key={item} type="button" role="tab" aria-selected={category === item} className={category === item ? 'category-tab active' : 'category-tab'} onClick={() => setCategory(item)}>{item}</button>
              ))}
            </div>
            <div className="shop-controls">
              <label className="sort-control">Price
                <select value={priceRange} onChange={(event) => setPriceRange(event.target.value)} aria-label="Filter by price range">
                  <option value="all">Any price</option>
                  <option value="under-1500">Under Tk 1,500</option>
                  <option value="1500-2000">Tk 1,500–2,000</option>
                  <option value="over-2000">Over Tk 2,000</option>
                </select>
              </label>
              <label className="sort-control">Rating
                <select value={minRating} onChange={(event) => setMinRating(event.target.value)} aria-label="Filter by minimum rating">
                  <option value="all">Any rating</option>
                  <option value="4.5">4.5 stars & up</option>
                  <option value="4.8">4.8 stars & up</option>
                </select>
              </label>
              <label className="sort-control">Sort
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort products">
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                  <option value="rating">Top rated</option>
                </select>
              </label>
            </div>
          </div>
          <div className="product-grid">
            {visibleProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image-wrap">
                  <img className="product-image" src={imageUrl(product.image)} alt={product.name} loading="lazy" />
                  {product.badge && <span className="product-badge">{product.badge}</span>}
                  <button className={favorites.has(product.id) ? 'favorite-button is-saved' : 'favorite-button'} type="button" aria-label={`${favorites.has(product.id) ? 'Remove' : 'Save'} ${product.name} ${favorites.has(product.id) ? 'from' : 'to'} favorites`} onClick={() => { const saved = !favorites.has(product.id); setFavorites((items) => { const next = new Set(items); if (saved) next.add(product.id); else next.delete(product.id); return next }); notify(saved ? 'Saved to your favorites' : 'Removed from your favorites') }}><Icon name="heart" size={18} /></button>
                  <button className="quick-add" type="button" onClick={() => addToCart(product)}>Add to bag <Icon name="plus" size={15} /></button>
                </div>
                <div className="product-details"><div><h3>{product.name}</h3><span className="product-color">{product.color}</span></div><span className="product-price">{formatPrice(product.price)}</span></div>
                <div className="product-rating"><span aria-label={`${product.rating} out of 5 stars`}>★★★★★</span><span>{product.rating} ({product.reviews})</span></div>
              </article>
            ))}
          </div>
          {visibleProducts.length === 0 && <div className="empty-search"><span>Nothing here just yet.</span><p>Try a different search or browse all of our good things.</p><button className="text-link" type="button" onClick={() => { setCategory('All'); setQuery('') }}>Show everything <Icon name="arrow" size={16} /></button></div>}
          <div className="shop-footnote"><span>Showing {visibleProducts.length} of {products.length} good things</span><span>Thoughtfully chosen. Happily lived in.</span></div>
        </section>

        <section className="story-section" id="our-story">
          <div className="story-image"><img src={imageUrl('photo-1441986300917-64674bd600d8', 1100)} alt="Sunlit shelves in a small independent shop" loading="lazy" /><span className="story-image-tag">A SMALLER, SOFTER WAY TO SHOP</span></div>
          <div className="story-copy"><span className="eyebrow">A NOTE FROM US</span><h2>Less, but<br /><em>lovelier.</em></h2><p>We think the best things aren’t the ones you replace next season. They’re the ones that find their way into your everyday, pick up a little history, and feel more yours with time.</p><a className="button button-outline" href="#shop">Get to know Devfolk <Icon name="arrow" size={17} /></a><div className="handwritten">Made with care, always <span>♡</span></div></div>
        </section>

        <section className="newsletter">
          <div><span className="eyebrow">A GOOD EMAIL, EVERY NOW AND THEN</span><h2>A little good in your inbox.</h2><p>First dibs, thoughtful finds, and 10% off your first order.</p></div>
          <form className="newsletter-form" onSubmit={(event) => { event.preventDefault(); event.currentTarget.reset(); notify('You’re on the list. Keep an eye on your inbox!') }}><label className="sr-only" htmlFor="newsletter-email">Your email address</label><input id="newsletter-email" type="email" placeholder="Your email address" required /><button type="submit" aria-label="Subscribe"><Icon name="arrow" size={19} /></button></form>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <a className="wordmark" href="#" aria-label="Devfolk home">Devfolk<span>.</span></a>
          <span>Thoughtfully made. Happily lived in.</span>
        </div>
        <div className="footer-company">
          <span>Developed by Jeon</span>
          <span>Uttara, Sector 11</span>
          <a href="https://www.facebook.com/Devfolk" target="_blank" rel="noreferrer">Facebook: Devfolk</a>
          <span>© {currentYear} Devfolk</span>
        </div>
      </footer>

      {cartOpen && <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false) }}>
        <aside className="cart-drawer" aria-label="Shopping bag">
          <div className="drawer-heading"><div><span className="eyebrow">YOUR GOOD THINGS</span><h2>Your bag <span>({itemCount})</span></h2></div><button className="icon-button" type="button" aria-label="Close bag" onClick={() => setCartOpen(false)}><Icon name="close" /></button></div>
          {cart.length === 0 ? <div className="cart-empty"><span className="empty-bag">♡</span><h3>A little room for good things.</h3><p>Your bag is taking a well-deserved breather.</p><button className="button button-dark" type="button" onClick={() => { setCartOpen(false); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }) }}>Explore the shop <Icon name="arrow" size={17} /></button></div> : <>
            <div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><img src={imageUrl(item.image, 240)} alt="" /><div className="cart-item-info"><h3>{item.name}</h3><span>{item.color}</span><div className="quantity-control"><button type="button" aria-label={`Decrease ${item.name} quantity`} onClick={() => updateQuantity(item.id, -1)}><Icon name="minus" size={14} /></button><span>{item.quantity}</span><button type="button" aria-label={`Increase ${item.name} quantity`} onClick={() => updateQuantity(item.id, 1)}><Icon name="plus" size={14} /></button></div></div><strong>{formatPrice(item.price * item.quantity)}</strong></div>)}</div>
            <div className="shipping-note"><Icon name="truck" size={19} /><span>{subtotal >= freeShippingThreshold ? 'You’ve unlocked complimentary shipping!' : `You’re ${formatPrice(freeShippingThreshold - subtotal)} away from complimentary shipping.`}</span></div>
            <div className="cart-summary"><div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div><p>Shipping and any applicable taxes are calculated at checkout.</p><button className="button button-dark checkout-button" type="button" onClick={() => { setCartOpen(false); setModal('checkout') }}>Continue to checkout <Icon name="arrow" size={17} /></button><button type="button" className="continue-shopping" onClick={() => setCartOpen(false)}>Keep looking around</button></div>
          </>}
        </aside>
      </div>}

      {modal && <div className="overlay modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal('') }}>
        <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
          <button className="icon-button dialog-close" type="button" aria-label="Close dialog" onClick={() => setModal('')}><Icon name="close" /></button>
          {modal === 'account' && <><span className="eyebrow">WELCOME TO DEVFOLK</span><h2 id="dialog-title">Come on <em>in.</em></h2><p className="dialog-intro">Sign in or make yourself at home. Good things are better shared.</p><form className="dialog-form" onSubmit={handleAccount}><label>Your name <span>(optional)</span><input name="name" autoComplete="name" placeholder="What should we call you?" /></label><label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label><button className="button button-dark" type="submit">Continue with email <Icon name="arrow" size={17} /></button></form><p className="fine-print">By continuing, you agree to our terms and privacy policy.</p></>}
          {modal === 'checkout' && <><span className="eyebrow">ALMOST YOURS</span><h2 id="dialog-title">A few <em>details.</em></h2><p className="dialog-intro">Your thoughtfully chosen things are just one step away.</p><form className="dialog-form checkout-form" onSubmit={placeOrder}><label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label><label>Full name<input name="name" autoComplete="name" placeholder="Your name" required /></label><label>Shipping address<input name="address" autoComplete="street-address" placeholder="Street address" required /></label><div className="checkout-row"><label>City<input name="city" autoComplete="address-level2" placeholder="City" required /></label><label>ZIP code<input name="zip" autoComplete="postal-code" placeholder="ZIP code" required /></label></div><label>Card number<input name="card" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" minLength="12" required /></label><div className="checkout-total"><span>Total</span><strong>{formatPrice(subtotal)}</strong></div><button className="button button-dark" type="submit">Place your order <Icon name="arrow" size={17} /></button><p className="fine-print">Demo checkout — no payment will be processed.</p></form></>}
          {modal === 'success' && <div className="success-state"><span className="success-icon"><Icon name="check" size={26} /></span><span className="eyebrow">THAT'S A WRAP</span><h2 id="dialog-title">Good things <em>coming.</em></h2><p className="dialog-intro">Your order is in! Thanks for choosing a more thoughtful kind of everyday.</p><button className="button button-dark" type="button" onClick={() => setModal('')}>Back to the good stuff <Icon name="arrow" size={17} /></button></div>}
        </section>
      </div>}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}

export default App
