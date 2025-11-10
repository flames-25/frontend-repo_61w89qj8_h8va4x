import { useEffect, useMemo, useState } from 'react'

const t = (locale) => ({
  en: {
    title: 'Pikalba — Sustainable Sports Gear',
    subtitle: 'Pickleball, Padel, Beach & Apparel',
    search: 'Search',
    categories: {
      all: 'All', pickleball: 'Pickleball', padel: 'Padel', beach: 'Beach Sports', apparel: 'Apparel'
    },
    wishlist: 'Wishlist',
    add: 'Add to cart',
    subscribe: 'Subscribe',
    newsletter: 'Join our newsletter',
    recommendations: 'You may also like',
    blog: 'From the blog',
    events: 'Upcoming events'
  },
  es: {
    title: 'Pikalba — Equipamiento Deportivo Sostenible',
    subtitle: 'Pickleball, Pádel, Playa y Ropa',
    search: 'Buscar',
    categories: {
      all: 'Todos', pickleball: 'Pickleball', padel: 'Pádel', beach: 'Deportes de Playa', apparel: 'Ropa'
    },
    wishlist: 'Favoritos',
    add: 'Añadir al carrito',
    subscribe: 'Suscribirse',
    newsletter: 'Únete a nuestro boletín',
    recommendations: 'También te puede gustar',
    blog: 'Del blog',
    events: 'Próximos eventos'
  }
})

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function App() {
  const [locale, setLocale] = useState('en')
  const i18n = useMemo(() => t(locale)[locale], [locale])
  const [category, setCategory] = useState('')
  const [q, setQ] = useState('')
  const [products, setProducts] = useState([])
  const [blog, setBlog] = useState([])
  const [events, setEvents] = useState([])

  useEffect(() => {
    fetch(`${API}/api/products${category ? `?category=${category}` : ''}`)
      .then(r => r.json()).then(setProducts).catch(() => setProducts([]))
    fetch(`${API}/api/blog`).then(r => r.json()).then(setBlog).catch(() => setBlog([]))
    fetch(`${API}/api/events`).then(r => r.json()).then(setEvents).catch(() => setEvents([]))
  }, [category])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return products
    return products.filter(p => (p.title || '').toLowerCase().includes(term) || (p.tags||[]).join(' ').toLowerCase().includes(term))
  }, [q, products])

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50 text-gray-900">
      <header className="sticky top-0 z-20 backdrop-blur bg-white/70 border-b border-emerald-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <span className="font-black text-2xl tracking-tight text-emerald-700">Pikalba</span>
          <span className="hidden sm:block text-sm text-gray-600">{i18n.subtitle}</span>
          <div className="ml-auto flex items-center gap-2">
            <select value={locale} onChange={e => setLocale(e.target.value)} className="px-2 py-1 rounded border text-sm">
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <h1 className="text-xl sm:text-2xl font-bold">{i18n.title}</h1>
          <div className="ml-auto flex-1 sm:flex-none">
            <input value={q} onChange={e => setQ(e.target.value)} placeholder={i18n.search}
              className="w-full sm:w-72 px-3 py-2 rounded-md border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"/>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {[['', i18n.categories.all], ['pickleball', i18n.categories.pickleball], ['padel', i18n.categories.padel], ['beach', i18n.categories.beach], ['apparel', i18n.categories.apparel]].map(([val, label]) => (
            <button key={val} onClick={() => setCategory(val)}
              className={`px-3 py-1 rounded-full border transition ${category===val? 'bg-emerald-600 text-white border-emerald-600':'bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50'}`}>
              {label}
            </button>
          ))}
        </div>

        <section className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(p => (
            <article key={p.sku} className="bg-white rounded-lg shadow-sm border border-emerald-100 overflow-hidden flex flex-col">
              <div className="aspect-square bg-emerald-50 flex items-center justify-center text-emerald-600 text-sm">{p.brand}</div>
              <div className="p-3 flex-1 flex flex-col">
                <h3 className="font-semibold line-clamp-2">{p.title}</h3>
                <p className="text-sm text-gray-500">{p.currency || 'USD'} ${p.price?.toFixed?.(2) || p.price}</p>
                <button className="mt-auto bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-3 py-2 rounded-md">{i18n.add}</button>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-10">
          <h2 className="font-bold text-lg mb-3">{i18n.blog}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {blog.map((b) => (
              <div key={b.slug} className="bg-white rounded-lg p-4 border border-emerald-100">
                <h3 className="font-semibold">{b.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">{b.content}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-bold text-lg mb-3">{i18n.events}</h2>
          <div className="space-y-2">
            {events.map((e) => (
              <div key={e.title+e.date} className="bg-white rounded-lg p-4 border border-emerald-100 flex items-center justify-between">
                <div>
                  <div className="font-medium">{e.title}</div>
                  <div className="text-sm text-gray-600">{new Date(e.date).toLocaleDateString()} · {e.location}</div>
                </div>
                {e.link && <a href={e.link} className="text-emerald-700 text-sm underline">Details</a>}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 bg-emerald-700 text-white rounded-lg p-6 flex flex-col sm:flex-row items-center gap-3">
          <div className="text-lg font-semibold flex-1">{i18n.newsletter}</div>
          <NewsletterForm i18n={i18n} />
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-gray-600">© {new Date().getFullYear()} Pikalba</footer>
    </div>
  )
}

function NewsletterForm({ i18n }){
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const submit = async () => {
    if (!email) return
    setStatus('loading')
    try {
      await fetch(`${API}/api/newsletter`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      setStatus('success')
      setEmail('')
    } catch (e) {
      setStatus('error')
    }
  }
  return (
    <div className="w-full sm:w-auto flex gap-2">
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="flex-1 px-3 py-2 rounded-md text-gray-900"/>
      <button onClick={submit} className="bg-white text-emerald-700 font-semibold px-4 py-2 rounded-md">{i18n.subscribe}</button>
      {status==='success' && <span className="text-emerald-200">✓</span>}
    </div>
  )
}

export default App
