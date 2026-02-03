import './App.css'

function App() {
  const products = [
    { id: 1, name: 'Lager Classic', description: 'Светлое, лёгкое, 4.7%', price: 90 },
    { id: 2, name: 'IPA Bitter Hop', description: 'Горькое, ароматное, 6.5%', price: 150 },
    { id: 3, name: 'Stout Dark Night', description: 'Тёмное, плотное, 7.2%', price: 170 },
    { id: 4, name: 'Wheat Summer', description: 'Пшеничное, освежающее, 5.0%', price: 120 },
  ]

  const [cart, setCart] = React.useState([])
  const [step, setStep] = React.useState('catalog') // catalog | checkout | done
  const [customer, setCustomer] = React.useState({
    name: '',
    phone: '',
    address: '',
  })

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  function addToCart(product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  function changeQuantity(id, delta) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  function handleInputChange(e) {
    const { name, value } = e.target
    setCustomer((prev) => ({ ...prev, [name]: value }))
  }

  function handleOrderSubmit(e) {
    e.preventDefault()
    if (!customer.name || !customer.phone || !customer.address || cart.length === 0) {
      alert('Заполни все поля и добавь хотя бы одно пиво в корзину.')
      return
    }
    setStep('done')
  }

  return (
    <div className="page">
      <header className="header">
        <h1 className="logo-text">Beer Shop</h1>
        <div className="header-cart">
          <span>В корзине: {cart.reduce((sum, item) => sum + item.quantity, 0)} шт.</span>
          <span className="header-total">{total} ₽</span>
        </div>
      </header>

      <main className="layout">
        {step === 'catalog' && (
          <section className="catalog">
            <h2>Выбери своё пиво</h2>
            <div className="product-list">
              {products.map((product) => (
                <article key={product.id} className="product-card">
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-footer">
                    <span className="product-price">{product.price} ₽</span>
                    <button onClick={() => addToCart(product)}>В корзину</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {step === 'checkout' && (
          <section className="checkout">
            <h2>Оформление заказа</h2>
            <form className="checkout-form" onSubmit={handleOrderSubmit}>
              <label>
                Имя
                <input
                  name="name"
                  value={customer.name}
                  onChange={handleInputChange}
                  placeholder="Как тебя зовут"
                />
              </label>
              <label>
                Телефон
                <input
                  name="phone"
                  value={customer.phone}
                  onChange={handleInputChange}
                  placeholder="+7..."
                />
              </label>
              <label>
                Адрес доставки
                <textarea
                  name="address"
                  value={customer.address}
                  onChange={handleInputChange}
                  placeholder="Город, улица, дом, подъезд"
                  rows={3}
                />
              </label>
              <div className="checkout-summary">
                <span>Итого к оплате: {total} ₽</span>
                <button type="submit">Отправить заказ</button>
              </div>
            </form>
          </section>
        )}

        {step === 'done' && (
          <section className="done">
            <h2>Заказ отправлен</h2>
            <p>Мы перезвоним, чтобы подтвердить заказ и доставку.</p>
            <button
              onClick={() => {
                setCart([])
                setCustomer({ name: '', phone: '', address: '' })
                setStep('catalog')
              }}
            >
              Сделать ещё один заказ
            </button>
          </section>
        )}

        <aside className="cart">
          <h2>Корзина</h2>
          {cart.length === 0 ? (
            <p className="cart-empty">Пока пусто. Добавь пиво из каталога.</p>
          ) : (
            <ul className="cart-list">
              {cart.map((item) => (
                <li key={item.id} className="cart-item">
                  <div>
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">
                      {item.price} ₽ × {item.quantity} = {item.price * item.quantity} ₽
                    </div>
                  </div>
                  <div className="cart-controls">
                    <button type="button" onClick={() => changeQuantity(item.id, -1)}>
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => changeQuantity(item.id, 1)}>
                      +
                    </button>
                    <button
                      type="button"
                      className="cart-remove"
                      onClick={() => removeFromCart(item.id)}
                    >
                      ×
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="cart-footer">
            <span>Итого: {total} ₽</span>
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={() => setStep('checkout')}
            >
              Оформить заказ
            </button>
          </div>
        </aside>
      </main>

      <footer className="footer">
        <small>Сайт для учебной работы. Алкоголь вреден для здоровья.</small>
      </footer>
    </div>
  )
}

export default App
