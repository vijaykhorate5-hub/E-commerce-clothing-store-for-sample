import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'

const navItems = [
  { label: 'Home', anchor: '' },
  { label: 'New Arrivals', anchor: 'new-arrivals' },
  { label: 'Collection', anchor: 'featured' },
  { label: 'About', anchor: 'about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { totalItems, setCartOpen } = useCart()
  const { wishlist } = useWishlist()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (item) => {
    setMenuOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      if (item.anchor) {
        setTimeout(() => {
          const el = document.getElementById(item.anchor)
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 300)
      }
    } else {
      if (item.anchor) {
        const el = document.getElementById(item.anchor)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  const handleLogout = () => { logout(); setDropdownOpen(false); navigate('/') }

  const navBg = scrolled || menuOpen
    ? 'bg-black/95 backdrop-blur-md py-4 border-b border-yellow-700/20'
    : 'py-6'

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-8">

          {/* Logo */}
          <Link to="/" className="text-xl md:text-2xl tracking-widest text-white font-serif flex-shrink-0">
            MAISON NOIR
          </Link>

          {/* Nav links */}
          <ul className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            {navItems.map(item => (
              <li key={item.label}>
                <button onClick={() => handleNavClick(item)} className="text-gray-400 text-xs tracking-widest uppercase hover:text-yellow-600 transition-colors duration-300">
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-5 flex-shrink-0">

            {/* Wishlist */}
            <button onClick={() => navigate('/wishlist')} className="relative text-gray-400 hover:text-yellow-600 transition-colors" title="Wishlist">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-600 text-black text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button onClick={() => setCartOpen(true)} className="relative text-gray-400 hover:text-yellow-600 transition-colors" title="Cart">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-600 text-black text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User */}
            {user ? (
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-yellow-600/15 border border-yellow-700/40 flex items-center justify-center">
                    <span className="text-yellow-600 text-sm font-semibold font-serif">{user.name[0].toUpperCase()}</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 bg-[#111] border border-white/10 shadow-2xl z-50">
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-white text-sm font-medium truncate">{user.name}</p>
                      <p className="text-gray-500 text-xs truncate mt-0.5">{user.email}</p>
                      {user.isAdmin && <span className="text-yellow-600 text-xs tracking-widest uppercase">Admin</span>}
                    </div>
                    <div className="py-1">
                      <button onClick={() => { navigate('/account'); setDropdownOpen(false) }} className="w-full text-left px-4 py-2.5 text-xs tracking-widest uppercase text-gray-400 hover:text-yellow-600 hover:bg-white/5 transition-colors">My Account</button>
                      <button onClick={() => { navigate('/wishlist'); setDropdownOpen(false) }} className="w-full text-left px-4 py-2.5 text-xs tracking-widest uppercase text-gray-400 hover:text-yellow-600 hover:bg-white/5 transition-colors">Wishlist {wishlist.length > 0 && `(${wishlist.length})`}</button>
                      {user.isAdmin && <button onClick={() => { navigate('/admin'); setDropdownOpen(false) }} className="w-full text-left px-4 py-2.5 text-xs tracking-widest uppercase text-gray-400 hover:text-yellow-600 hover:bg-white/5 transition-colors">Admin Panel</button>}
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-xs tracking-widest uppercase text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors">Sign Out</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => navigate('/auth')} className="text-xs tracking-widest uppercase border border-white/10 text-gray-400 px-4 py-2 hover:border-yellow-700/50 hover:text-yellow-600 transition-all duration-300">
                Sign In
              </button>
            )}
          </div>

          {/* Mobile right */}
          <div className="lg:hidden flex items-center gap-4">
            <button onClick={() => setCartOpen(true)} className="relative text-white hover:text-yellow-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && <span className="absolute -top-1.5 -right-1.5 bg-yellow-600 text-black text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">{totalItems}</span>}
            </button>
            <button className="flex flex-col gap-1.5 z-50" onClick={() => setMenuOpen(!menuOpen)}>
              <span className={`block w-6 h-px bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-px bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-px bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div className={`fixed inset-0 bg-black z-40 flex flex-col items-center justify-center transition-all duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <ul className="flex flex-col items-center gap-8 mb-10">
          {navItems.map(item => (
            <li key={item.label}>
              <button onClick={() => handleNavClick(item)} className="font-serif text-4xl text-white hover:text-yellow-600 transition-colors duration-300 tracking-wide">
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex flex-col items-center gap-3 w-52">
          {user ? (
            <>
              <div className="text-center mb-2">
                <p className="text-white text-sm">{user.name}</p>
                <p className="text-gray-500 text-xs">{user.email}</p>
              </div>
              <button onClick={() => { navigate('/account'); setMenuOpen(false) }} className="w-full text-xs tracking-widest uppercase border border-white/10 text-gray-400 py-3 hover:border-yellow-700/50 hover:text-yellow-600 transition-all">My Account</button>
              <button onClick={() => { navigate('/wishlist'); setMenuOpen(false) }} className="w-full text-xs tracking-widest uppercase border border-white/10 text-gray-400 py-3 hover:border-yellow-700/50 hover:text-yellow-600 transition-all">Wishlist {wishlist.length > 0 && `(${wishlist.length})`}</button>
              {user.isAdmin && <button onClick={() => { navigate('/admin'); setMenuOpen(false) }} className="w-full text-xs tracking-widest uppercase border border-yellow-700/30 text-yellow-600 py-3 hover:bg-yellow-600/10 transition-all">Admin Panel</button>}
              <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="text-xs tracking-widest uppercase text-gray-600 hover:text-red-400 transition-colors py-2">Sign Out</button>
            </>
          ) : (
            <button onClick={() => { navigate('/auth'); setMenuOpen(false) }} className="w-full text-xs tracking-widest uppercase border border-white/10 text-gray-400 py-3 hover:border-yellow-700/50 hover:text-yellow-600 transition-all">Sign In</button>
          )}
        </div>
      </div>

      {dropdownOpen && <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />}
    </>
  )
}