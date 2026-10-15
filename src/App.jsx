import { useEffect, useState } from 'react'
import { Trophy, User, Building2, MapPin, LogOut, Search, Plus, Trash2, ImagePlus, Clock, Phone, Wallet, Inbox, LayoutGrid, CalendarCheck, ClipboardList, ArrowLeft } from 'lucide-react'
import { load, save, getMe, setMe } from './store.js'

const som = (n) => Number(n || 0).toLocaleString('uz-UZ').replace(/,/g, ' ') + " so'm"
const pad = (n) => String(n).padStart(2, '0')
const ds = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const todayStr = () => ds(new Date())
const days = (n) => Array.from({ length: n }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d })
const WD = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan']
const MO = ['yan', 'fev', 'mar', 'apr', 'may', 'iyun', 'iyul', 'avg', 'sen', 'okt', 'noy', 'dek']
const dLabel = (s) => { const [, m, d] = s.split('-').map(Number); return `${d}-${MO[m - 1]}` }
const rng = (b) => `${pad(b.hour)}:00–${pad(b.hour + b.hours)}:00`
const HOURS = Array.from({ length: 16 }, (_, i) => i + 8)
const FALLBACK = '/img/default.jpg'
const ROLE = { customer1: 'Buyurtma beruvchi 1', customer2: 'Buyurtma beruvchi 2', owner: 'Qabul qiluvchi' }
const ST = {
  kutilmoqda: ['Kutilmoqda', 'bg-blue-100 text-blue-800'],
  qabul: ['Qabul qilindi', 'bg-green-100 text-green-800'],
  yakunlandi: ['Yakunlandi', 'bg-slate-900 text-white'],
  rad: ['Rad etildi', 'bg-red-100 text-red-700'],
}
// Barcha tugmalar: yashil fon, oq yozuv
const gb = (on) => (on ? 'bg-green-800 ring-2 ring-white text-white font-bold' : 'bg-green-600 hover:bg-green-700 text-white font-bold') + ' transition disabled:opacity-50 disabled:cursor-not-allowed'
const Badge = ({ s }) => <span className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${ST[s][1]}`}>{ST[s][0]}</span>
const Img = ({ src, className = '' }) => (
  <img src={src || FALLBACK} alt="" loading="lazy" className={`object-cover ${className}`}
    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK }} />
)
const inp = 'w-full rounded-lg bg-white border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600'
const card = 'bg-white rounded-xl border border-slate-200 shadow-sm'
const toDataUrl = (file) => new Promise((res) => {
  const r = new FileReader()
  r.onload = () => {
    const im = new Image()
    im.onload = () => {
      const s = Math.min(1, 800 / im.width), c = document.createElement('canvas')
      c.width = im.width * s; c.height = im.height * s
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height)
      res(c.toDataURL('image/jpeg', 0.8))
    }
    im.src = r.result
  }
  r.readAsDataURL(file)
})
const Tabs = ({ tabs, tab, set }) => (
  <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${tabs.length},1fr)` }}>
    {tabs.map(([k, t, I, n]) => (
      <button key={k} onClick={() => { set(k); window.scrollTo({ top: 0 }) }}
        className={`relative py-3 rounded-lg text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${gb(tab === k)}`}>
        <I size={18} /><span>{t}</span>
        {n > 0 && <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">{n}</span>}
      </button>
    ))}
  </div>
)
const Hero = ({ title, sub, children }) => (
  <section className="text-white" style={{ backgroundImage: "linear-gradient(rgba(4,12,32,.72),rgba(4,12,32,.92)),url(/img/bg-hero.jpg)", backgroundSize: 'cover', backgroundPosition: 'center' }}>
    <div className="max-w-5xl mx-auto px-4 pt-8 pb-5">
      <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">{title}</h1>
      <p className="text-blue-100 mt-2 mb-6 max-w-xl">{sub}</p>
      {children}
    </div>
  </section>
)

export default function App() {
  const [db, setDb] = useState(load)
  const [meId, setMeId] = useState(getMe)
  // Har safar eng yangi ma'lumot ustiga yoziladi (boshqa oynadagi o'zgarishlar yo'qolmaydi)
  const upd = (f) => setDb(() => { const n = f(load()); save(n); return n })
  useEffect(() => {
    const h = () => setDb(load())
    window.addEventListener('storage', h)
    window.addEventListener('focus', h)
    return () => { window.removeEventListener('storage', h); window.removeEventListener('focus', h) }
  }, [])
  const me = db.users.find((u) => u.id === meId)
  const login = (id) => { setMe(id); setMeId(id) }
  const logout = () => { setMe(null); setMeId(null) }
  if (!me) return <Auth db={db} upd={upd} onLogin={login} />
  const owner = me.role === 'owner'
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-black text-white border-b-4 border-red-600">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center"><Trophy size={22} /></div>
            <div className="text-2xl font-black tracking-tight">Maydon<span className="text-green-500">.uz</span></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right text-sm leading-tight hidden sm:block">
              <div className="font-bold">{me.name}</div>
              <div className="text-slate-400 flex items-center gap-1 justify-end">{owner ? <Building2 size={13} /> : <User size={13} />}{ROLE[me.role]}</div>
            </div>
            <button onClick={logout} className={`rounded-lg px-4 py-2 flex items-center gap-2 ${gb(false)}`}><LogOut size={16} />Chiqish</button>
          </div>
        </div>
      </header>
      {owner ? <Owner db={db} upd={upd} me={me} /> : <Customer db={db} upd={upd} me={me} />}
    </div>
  )
}

function Auth({ db, upd, onLogin }) {
  const [tab, setTab] = useState('login')
  const [f, setF] = useState({ name: '', phone: '', password: '', role: 'customer1' })
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const register = () => {
    setErr(''); setOk('')
    if (f.name.trim().length < 2) return setErr('Ismingizni kiriting')
    if (!/^\d{9}$/.test(f.phone)) return setErr("Telefon raqam 9 ta raqamdan iborat bo'lsin (masalan 901234567)")
    if (f.password.length < 4) return setErr("Parol kamida 4 belgi bo'lsin")
    if (load().users.some((u) => u.phone === f.phone)) return setErr("Bu raqam allaqachon ro'yxatdan o'tgan")
    upd((p) => ({ ...p, users: [...p.users, { id: Date.now(), name: f.name.trim(), phone: f.phone, password: f.password, role: f.role }] }))
    setOk("Ro'yxatdan o'tdingiz! Endi parolingiz bilan kiring.")
    setF({ ...f, name: '' }); setTab('login')
  }
  const enter = (role) => {
    setErr(''); setOk('')
    const u = load().users.find((x) => x.phone === f.phone && x.password === f.password)
    if (!u) return setErr("Telefon raqam yoki parol noto'g'ri")
    if (u.role !== role) return setErr(`Siz "${ROLE[u.role]}" sifatida ro'yxatdan o'tgansiz. Shu tugmani bosing.`)
    onLogin(u.id)
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,.55),rgba(4,12,32,.75)),url(/img/bg-login.jpg)", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border-t-4 border-red-600">
        <div className="text-center mb-5">
          <div className="mx-auto w-16 h-16 rounded-xl bg-black flex items-center justify-center"><Trophy className="text-green-500" size={32} /></div>
          <h1 className="text-3xl font-black text-black mt-2">Maydon<span className="text-green-600">.uz</span></h1>
          <p className="text-slate-500">Stadion va futbol maydonlarini onlayn band qiling</p>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[['login', 'Kirish'], ['reg', "Ro'yxatdan o'tish"]].map(([k, t]) => (
            <button key={k} onClick={() => { setTab(k); setErr(''); setOk('') }} className={`py-3 rounded-lg ${gb(tab === k)}`}>{t}</button>
          ))}
        </div>
        <div className="space-y-3">
          {tab === 'reg' && <input className={inp} placeholder="Ism" value={f.name} onChange={set('name')} />}
          <input className={inp} placeholder="Telefon (9 raqam)" inputMode="numeric" value={f.phone} onChange={set('phone')} />
          <input className={inp} type="password" placeholder="Parol" value={f.password} onChange={set('password')} />
          {tab === 'reg' && (
            <select className={inp} value={f.role} onChange={set('role')}>
              <option value="customer1">Buyurtma beruvchi 1</option>
              <option value="customer2">Buyurtma beruvchi 2</option>
              <option value="owner">Qabul qiluvchi (maydon egasi)</option>
            </select>
          )}
        </div>
        {err && <div className="mt-3 rounded-lg bg-red-50 text-red-600 px-4 py-3 text-sm">{err}</div>}
        {ok && <div className="mt-3 rounded-lg bg-green-50 text-green-700 px-4 py-3 text-sm">{ok}</div>}
        {tab === 'reg' ? (
          <button onClick={register} className={`mt-4 w-full py-3 rounded-lg ${gb(false)}`}>Ro'yxatdan o'tish</button>
        ) : (
          <>
            <p className="text-xs text-slate-400 mt-3">Demo (parol demo123): 900000001 — Buyurtma beruvchi 1, 900000003 — Buyurtma beruvchi 2, 900000002 — Qabul qiluvchi.</p>
            <p className="text-center font-bold text-slate-700 mt-3 mb-2">Kirish uchun rolni tanlang:</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => enter('customer1')} className={`py-4 rounded-lg flex items-center justify-center gap-2 ${gb(false)}`}><User size={18} />Buyurtma beruvchi 1</button>
              <button onClick={() => enter('customer2')} className={`py-4 rounded-lg flex items-center justify-center gap-2 ${gb(false)}`}><User size={18} />Buyurtma beruvchi 2</button>
              <button onClick={() => enter('owner')} className={`col-span-2 py-4 rounded-lg flex items-center justify-center gap-2 ${gb(false)}`}><Building2 size={18} />Qabul qiluvchi</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function Customer({ db, upd, me }) {
  const [tab, setTab] = useState('fields')
  const [fid, setFid] = useState(null)
  const [date, setDate] = useState(todayStr())
  const [dur, setDur] = useState(1)
  const [start, setStart] = useState(null)
  const [msg, setMsg] = useState('')
  const [hl, setHl] = useState(null)
  const [q, setQ] = useState('')
  const field = db.fields.find((x) => x.id === fid)
  const nowH = new Date().getHours()
  const live = (b) => b.status !== 'rad'
  const at = (h) => db.bookings.find((b) => b.fieldId === fid && b.date === date && live(b) && h >= b.hour && h < b.hour + b.hours)
  const past = (h) => date === todayStr() && h <= nowH
  const okStart = (h) => h + dur <= 24 && Array.from({ length: dur }, (_, i) => h + i).every((x) => !at(x) && !past(x))
  const picked = (h) => start !== null && h >= start && h < start + dur
  const ownerName = (x) => db.users.find((u) => u.id === x.ownerId)?.name || 'Maydon.uz'
  const list = db.fields.filter((x) => (x.name + ' ' + x.address).toLowerCase().includes(q.toLowerCase()))
  const mine = db.bookings.filter((b) => b.customerId === me.id).sort((a, b) => (b.at || 0) - (a.at || 0))
  const here = mine.filter((b) => b.fieldId === fid && live(b))
  const sum = mine.filter(live).reduce((s, b) => s + (b.total || 0), 0)
  const open = (x) => { setFid(x.id); setDate(todayStr()); setDur(1); setStart(null); setMsg(''); setHl(null); setTab('book'); window.scrollTo({ top: 0 }) }
  const cancel = (id) => upd((p) => ({ ...p, bookings: p.bookings.filter((x) => x.id !== id) }))
  const book = () => {
    const latest = load()
    const clash = latest.bookings.some((b) => b.fieldId === fid && b.date === date && live(b) && b.hour < start + dur && start < b.hour + b.hours)
    if (clash) { upd(() => latest); setStart(null); setMsg('Bu vaqt hozirgina boshqa mijoz tomonidan band qilindi. Boshqa vaqtni tanlang.'); return }
    const nb = { id: 'b' + Date.now() + Math.random().toString(36).slice(2, 6), at: Date.now(), fieldId: fid, customerId: me.id, date, hour: start, hours: dur, total: field.price * dur, status: 'kutilmoqda' }
    upd((p) => ({ ...p, bookings: [...p.bookings, nb] }))
    setStart(null); setMsg(''); setTab('orders'); window.scrollTo({ top: 0 })
  }
  const hs = (h) => {
    const b = at(h)
    if (b) return b.customerId === me.id ? 'bg-blue-800 text-white ring-2 ring-black' : 'bg-slate-700 text-white line-through'
    if (past(h)) return 'bg-slate-200 text-slate-400 line-through'
    if (picked(h)) return 'bg-blue-900 text-white ring-2 ring-black'
    return okStart(h) ? gb(false) : 'bg-slate-100 text-slate-400'
  }
  return (
    <>
      <Hero title="Futbol maydonini onlayn band qiling" sub={`${db.fields.length} ta maydon. Sana va soatni tanlang, buyurtma bering, egasi tasdiqlaydi.`}>
        <Tabs tab={tab} set={setTab} tabs={[['fields', 'Maydonlar', LayoutGrid], ['book', 'Band qilish', CalendarCheck], ['orders', 'Buyurtmalarim', ClipboardList, mine.filter((b) => b.status === 'kutilmoqda').length]]} />
      </Hero>
      <main className="max-w-5xl mx-auto p-4">
        {tab === 'fields' && (
          <section>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h2 className="text-2xl font-black text-black">Maydonlar ({list.length})</h2>
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input className={inp + ' pl-9'} placeholder="Nom yoki manzil bo'yicha qidirish" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
            </div>
            {list.length === 0 && <p className="text-slate-500">Hech narsa topilmadi. Boshqa nom yoki tumanni yozib ko'ring.</p>}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {list.map((x) => (
                <div key={x.id} onClick={() => open(x)} className={`${card} overflow-hidden cursor-pointer hover:shadow-lg hover:border-green-600 transition flex flex-col`}>
                  <div className="relative">
                    <Img src={x.img} className="w-full h-28 sm:h-32" />
                    <span className="absolute bottom-2 left-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded">{som(x.price)} / soat</span>
                  </div>
                  <div className="p-3 flex-1 flex flex-col">
                    <div className="font-extrabold text-black leading-tight">{x.name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-1"><MapPin size={12} />{x.address}</div>
                    <div className="text-xs text-slate-400 mb-3">Egasi: {ownerName(x)}</div>
                    <button className={`mt-auto w-full py-2 rounded-lg text-sm ${gb(false)}`}>Band qilish</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {tab === 'book' && !field && (
          <div className={`${card} p-8 text-center`}>
            <p className="text-slate-600 mb-4">Avval maydonni tanlang.</p>
            <button onClick={() => setTab('fields')} className={`px-5 py-3 rounded-lg ${gb(false)}`}>Maydonlarni ko'rish</button>
          </div>
        )}
        {tab === 'book' && field && (
          <section className={`${card} overflow-hidden`}>
            <Img src={field.img} className="w-full h-48 sm:h-72" />
            <div className="p-4 space-y-5">
              <button onClick={() => setTab('fields')} className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1 ${gb(false)}`}><ArrowLeft size={16} />Maydonlarga qaytish</button>
              <div>
                <h3 className="font-black text-2xl text-black">{field.name}</h3>
                <div className="text-slate-500 flex items-center gap-1"><MapPin size={14} />{field.address}</div>
                <div className="text-slate-500 text-sm">Egasi: {ownerName(field)}</div>
                <div className="font-black text-green-700 text-xl mt-1">{som(field.price)} / soat</div>
              </div>
              <div>
                <div className="font-bold mb-2">Sanani tanlang</div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {days(14).map((d) => { const s = ds(d); return (
                    <button key={s} onClick={() => { setDate(s); setStart(null) }} className={`shrink-0 w-16 rounded-lg py-2 text-center ${date === s ? 'bg-blue-900 text-white ring-2 ring-black' : gb(false)}`}>
                      <div className="text-xs">{WD[d.getDay()]}</div><div className="text-xl font-black">{d.getDate()}</div><div className="text-xs">{MO[d.getMonth()]}</div>
                    </button>) })}
                </div>
              </div>
              <div>
                <div className="font-bold mb-2">Necha soat o'ynaysiz?</div>
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5].map((n) => <button key={n} onClick={() => { setDur(n); setStart(null) }} className={`px-4 py-2 rounded-lg ${dur === n ? 'bg-blue-900 text-white ring-2 ring-black font-bold' : gb(false)}`}>{n} soat</button>)}
                </div>
              </div>
              <div>
                <div className="font-bold mb-2">Boshlanish vaqtini tanlang ({dLabel(date)})</div>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {HOURS.map((h) => {
                    const b = at(h); const own = b && b.customerId === me.id
                    return (
                      <button key={h} disabled={!b && !okStart(h)} onClick={() => (own ? setHl(b.id) : !b && setStart(h))} className={`py-2 rounded-lg font-bold text-sm leading-tight ${hs(h)}`}>
                        {h}:00{b && <div className="text-[10px] font-normal no-underline">{own ? 'Sizniki' : 'Band'}</div>}
                      </button>
                    )
                  })}
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-slate-500 mt-3">
                  <span className="flex items-center gap-1"><i className="w-3 h-3 rounded bg-green-600 inline-block" />Bo'sh</span>
                  <span className="flex items-center gap-1"><i className="w-3 h-3 rounded bg-slate-700 inline-block" />Band (boshqa mijoz)</span>
                  <span className="flex items-center gap-1"><i className="w-3 h-3 rounded bg-blue-800 inline-block" />Sizning buyurtmangiz</span>
                  <span className="flex items-center gap-1"><i className="w-3 h-3 rounded bg-slate-200 inline-block" />O'tib ketgan</span>
                </div>
              </div>
              {here.length > 0 && (
                <div>
                  <div className="font-bold mb-2">Shu maydondagi buyurtmalaringiz</div>
                  <div className="space-y-2">
                    {here.map((b) => (
                      <div key={b.id} className={`rounded-lg border p-3 flex flex-wrap items-center justify-between gap-2 ${hl === b.id ? 'border-blue-800 bg-blue-50' : 'border-slate-200'}`}>
                        <div className="text-sm"><b>{dLabel(b.date)}</b> · {rng(b)} · {b.hours} soat · <b className="text-green-700">{som(b.total)}</b></div>
                        <div className="flex items-center gap-2"><Badge s={b.status} />{b.status === 'kutilmoqda' && <button onClick={() => cancel(b.id)} className={`px-3 py-1 rounded-lg text-sm ${gb(false)}`}>Bekor qilish</button>}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {msg && <div className="rounded-lg bg-red-50 text-red-600 px-4 py-3 text-sm">{msg}</div>}
              {start !== null && (
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                  <div className="font-bold">{field.name}</div>
                  <div className="text-sm text-slate-600">{dLabel(date)} · {pad(start)}:00–{pad(start + dur)}:00 · {dur} soat</div>
                  <div className="font-black text-xl text-green-700 mt-1">Jami: {som(field.price * dur)}</div>
                </div>
              )}
              <button disabled={start === null} onClick={book} className={`w-full py-4 rounded-lg text-lg ${gb(false)}`}>{start === null ? 'Vaqtni tanlang' : 'Buyurtma berish'}</button>
            </div>
          </section>
        )}
        {tab === 'orders' && (
          <section>
            <div className="rounded-xl p-4 text-white bg-blue-900 mb-4 flex items-center justify-between border-l-8 border-green-500">
              <div><div className="text-sm text-blue-200">Jami buyurtmalar summasi</div><div className="text-3xl font-black">{som(sum)}</div></div>
              <Wallet size={34} className="text-blue-200" />
            </div>
            {mine.length === 0 && <p className="text-slate-500">Hali buyurtma yo'q. "Maydonlar" bo'limidan maydon tanlang.</p>}
            <div className="space-y-2">
              {mine.map((b) => {
                const fl = db.fields.find((x) => x.id === b.fieldId)
                return (
                  <div key={b.id} className={`${card} p-3 flex flex-wrap items-center justify-between gap-2`}>
                    <div className="flex items-center gap-3">
                      <Img src={fl?.img} className="w-16 h-16 rounded-lg" />
                      <div>
                        <div className="font-extrabold text-black">{fl?.name}</div>
                        <div className="text-sm text-slate-500 flex items-center gap-1"><Clock size={13} />{dLabel(b.date)} · {rng(b)} · {b.hours} soat</div>
                        <div className="font-black text-green-700">{som(b.total)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge s={b.status} />
                      {b.status === 'kutilmoqda' && <button onClick={() => cancel(b.id)} className={`px-3 py-2 rounded-lg text-sm ${gb(false)}`}>Bekor qilish</button>}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </main>
    </>
  )
}

function Owner({ db, upd, me }) {
  const [tab, setTab] = useState('orders')
  const [f, setF] = useState({ name: '', address: '', price: '', img: '' })
  const [err, setErr] = useState('')
  const [sel, setSel] = useState(todayStr())
  const mineF = db.fields.filter((x) => x.ownerId === me.id)
  // Umumiy (tayyor) maydonlar buyurtmalari barcha qabul qiluvchilarda ko'rinadi
  const ids = db.fields.filter((x) => x.ownerId === me.id || x.ownerId == null).map((x) => x.id)
  const orders = db.bookings.filter((b) => ids.includes(b.fieldId)).sort((a, b) => (b.at || 0) - (a.at || 0))
  const paid = orders.filter((b) => b.status === 'qabul' || b.status === 'yakunlandi')
  const pending = orders.filter((b) => b.status === 'kutilmoqda').length
  const setStatus = (id, status) => upd((p) => ({ ...p, bookings: p.bookings.map((b) => (b.id === id ? { ...b, status } : b)) }))
  const pick = async (e) => { const file = e.target.files?.[0]; if (file) setF({ ...f, img: await toDataUrl(file) }) }
  const changeImg = async (id, e) => { const file = e.target.files?.[0]; if (file) { const img = await toDataUrl(file); upd((p) => ({ ...p, fields: p.fields.map((x) => (x.id === id ? { ...x, img } : x)) })) } }
  const add = () => {
    if (!f.name.trim() || !f.address.trim() || !(Number(f.price) > 0)) return setErr("Nom, manzil va narxni to'g'ri kiriting")
    setErr('')
    upd((p) => ({ ...p, fields: [{ id: Date.now(), ownerId: me.id, name: f.name.trim(), address: f.address.trim(), price: Number(f.price), img: f.img }, ...p.fields] }))
    setF({ name: '', address: '', price: '', img: '' })
  }
  const byDay = {}
  paid.forEach((b) => { byDay[b.date] = (byDay[b.date] || 0) + (b.total || 0) })
  const dayList = [...new Set([todayStr(), ...Object.keys(byDay)])].sort().reverse()
  const dayOrders = paid.filter((b) => b.date === sel)
  const Row = ({ b, actions }) => {
    const fl = db.fields.find((x) => x.id === b.fieldId)
    const cu = db.users.find((u) => u.id === b.customerId)
    return (
      <div className={`${card} p-3 space-y-3`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <Img src={fl?.img} className="w-16 h-16 rounded-lg" />
            <div>
              <div className="font-extrabold text-black">{fl?.name}</div>
              <div className="text-sm text-slate-500 flex items-center gap-1"><Clock size={13} />{dLabel(b.date)} · {rng(b)} · {b.hours} soat</div>
              <div className="text-sm text-slate-500 flex items-center gap-1"><Phone size={13} />{cu?.name} ({ROLE[cu?.role]}) · +998 {cu?.phone}</div>
            </div>
          </div>
          <div className="text-right space-y-1"><div className="font-black text-green-700">{som(b.total)}</div><Badge s={b.status} /></div>
        </div>
        {actions && (
          <div className="flex flex-wrap gap-2">
            {[['qabul', 'Qabul qilindi'], ['kutilmoqda', 'Kutilmoqda'], ['yakunlandi', 'Yakunlandi'], ['rad', 'Rad etish']].map(([k, t]) => (
              <button key={k} onClick={() => setStatus(b.id, k)} className={`rounded-lg px-3 py-2 text-sm ${gb(b.status === k)}`}>{t}</button>
            ))}
          </div>
        )}
      </div>
    )
  }
  return (
    <>
      <Hero title="Qabul qiluvchi paneli" sub="Mijozlar buyurtmalarini boshqaring, maydon qo'shing va kunlik tushumni kuzating.">
        <Tabs tab={tab} set={setTab} tabs={[['orders', 'Yangi buyurtmalar', Inbox, pending], ['fields', 'Maydonlar', Building2], ['stats', 'Davomat', Wallet]]} />
      </Hero>
      <main className="max-w-5xl mx-auto p-4">
        {tab === 'orders' && (
          <section className="space-y-2">
            {orders.length === 0 && <p className="text-slate-500">Hozircha buyurtma yo'q. Mijoz maydonni band qilsa, shu yerda chiqadi.</p>}
            {orders.map((b) => <Row key={b.id} b={b} actions />)}
          </section>
        )}
        {tab === 'fields' && (
          <section className="space-y-4">
            <div className={`${card} p-4`}>
              <h2 className="text-xl font-black text-black mb-3">Maydon qo'shish</h2>
              <div className="grid sm:grid-cols-4 gap-2">
                <input className={inp} placeholder="Nomi" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
                <input className={inp} placeholder="Manzil" value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} />
                <input className={inp} placeholder="Narx (so'm/soat)" inputMode="numeric" value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} />
                <button onClick={add} className={`rounded-lg py-3 flex items-center justify-center gap-2 ${gb(false)}`}><Plus size={18} />Qo'shish</button>
              </div>
              <label className={`mt-3 inline-flex items-center gap-2 cursor-pointer text-sm rounded-lg px-3 py-2 ${gb(false)}`}>
                <ImagePlus size={18} /> Rasm tanlash<input type="file" accept="image/*" className="hidden" onChange={pick} />
              </label>
              {f.img && <Img src={f.img} className="mt-2 w-40 h-24 rounded-lg" />}
              {err && <p className="text-red-600 text-sm mt-2">{err}</p>}
            </div>
            <h2 className="text-xl font-black text-black">Mening maydonlarim ({mineF.length})</h2>
            {mineF.length === 0 && <p className="text-slate-500">Siz hali maydon qo'shmagansiz. Qo'shgan maydoningiz mijozlarga darhol ko'rinadi.</p>}
            {mineF.map((x) => (
              <div key={x.id} className={`${card} flex items-center justify-between gap-2 p-2`}>
                <div className="flex items-center gap-3">
                  <Img src={x.img} className="w-16 h-12 rounded-lg" />
                  <div><b>{x.name}</b><div className="text-xs text-slate-500">{x.address} · {som(x.price)}</div></div>
                </div>
                <div className="flex gap-2">
                  <label className={`cursor-pointer p-2 rounded-lg ${gb(false)}`} aria-label="Rasmni almashtirish"><ImagePlus size={18} /><input type="file" accept="image/*" className="hidden" onChange={(e) => changeImg(x.id, e)} /></label>
                  <button onClick={() => upd((p) => ({ ...p, fields: p.fields.filter((y) => y.id !== x.id), bookings: p.bookings.filter((b) => b.fieldId !== x.id) }))} className={`p-2 rounded-lg ${gb(false)}`} aria-label="O'chirish"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </section>
        )}
        {tab === 'stats' && (
          <section className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-4 text-white bg-green-700"><div className="text-sm opacity-90">Bugungi tushum</div><div className="text-xl sm:text-2xl font-black">{som(byDay[todayStr()])}</div></div>
              <div className="rounded-xl p-4 text-white bg-blue-900"><div className="text-sm opacity-90">Jami tushum</div><div className="text-xl sm:text-2xl font-black">{som(paid.reduce((s, b) => s + (b.total || 0), 0))}</div></div>
            </div>
            <p className="text-sm text-slate-500">Tushumga faqat "Qabul qilindi" va "Yakunlandi" buyurtmalar kiradi. Kunni bossangiz, o'sha kunning buyurtmalari ochiladi.</p>
            <div className="space-y-2">
              {dayList.map((d) => (
                <button key={d} onClick={() => setSel(d)} className={`w-full flex justify-between items-center rounded-lg p-3 text-left ${gb(sel === d)}`}>
                  <span>{dLabel(d)}{d === todayStr() ? ' (bugun)' : ''}</span><span>{som(byDay[d])}</span>
                </button>
              ))}
            </div>
            <h3 className="font-black text-black">{dLabel(sel)} buyurtmalari ({dayOrders.length})</h3>
            {dayOrders.length === 0 && <p className="text-slate-500">Bu kunda qabul qilingan buyurtma yo'q.</p>}
            {dayOrders.map((b) => <Row key={b.id} b={b} />)}
          </section>
        )}
      </main>
    </>
  )
}
