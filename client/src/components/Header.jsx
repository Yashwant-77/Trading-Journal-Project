import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../store/authSlice";

function Header({ onNewTradeClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const menuRef = useRef(null); // 2. Created a ref for the menu container
  const dispatch = useDispatch();

  // 3. Close menu when clicking outside
  useEffect(() => {
    // If the menu is closed, don't bind anything
    if (!isMenuOpen) return;


    const handleLogoutBttn = ()=>{
      dispatch(logout());
    }



    function handleClickOutside(event) {
      // If the clicked element is NOT inside our menu container, close it
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    // Using a tiny timeout ensures the event that OPENS the menu
    // finishes clearing before we start listening for the CLOSE action.
    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuOpen]);
  const navItems = [
    { label: "Dashboard", description: "Get summary , analytics and insights of past trades", href: "/" },
    { label: "Trades",description: "View , Add , Edit , Delete Your Trades", href: "/view-trades" },
    { label: "Playbook", description: "Create , View , Edit , Delete your Playbooks", href: "/playbooks" },
    { label: "Calendar",description: "See your performance of perticular day", href: "/calendar" },
    { label: "Settings",description: "Account settings ", href: "/settings" },
  ];

 

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-3"
          aria-label="TradeLedger home"
        >
          <span className="grid h-10 w-10 place-items-center rounded-lg border border-emerald-400/30 bg-emerald-400/10 text-lg font-bold text-emerald-300">
            TL
          </span>
          <span className="min-w-0">
            <span className="block text-base font-semibold tracking-wide text-white">
              TradeLedger
            </span>
            <span className="hidden text-xs text-zinc-400 sm:block">
              Trading journal for disciplined traders
            </span>
          </span>
        </Link>

        {isAuthenticated && (
          <nav
            className="hidden items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900/60 p-1 lg:flex"
            aria-label="Primary navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {isAuthenticated && (
          <div className="relative flex items-center gap-3">
            <button className="hidden rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900 sm:inline-flex">
              Import Trades
            </button>


            <Link to='/add-trade' className="cursor-pointer">
            
            
            <button
              className="rounded-lg hidden sm:block bg-emerald-400 px-4 py-2 text-sm font-bold text-zinc-950 transition hover:bg-emerald-300"
            >
              New Trade
            </button>
            </Link>
            <button
              ref={menuRef}
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
              aria-expanded={isMenuOpen}
              aria-controls="header-navigation-menu"
              onClick={() => setIsMenuOpen((current) => !current)}
            >
              <span
                className="flex h-4 w-4 flex-col justify-center gap-1"
                aria-hidden="true"
              >
                <span className="block h-0.5 w-4 rounded-full bg-current" />
                <span className="block h-0.5 w-4 rounded-full bg-current" />
                <span className="block h-0.5 w-4 rounded-full bg-current" />
              </span>
            </button>

            {isMenuOpen && (
              <div
                id="header-navigation-menu"
                className="absolute right-0 top-12 w-[min(92vw,24rem)] rounded-lg border border-zinc-800 bg-zinc-950 p-2 shadow-2xl shadow-black/40"
              >
                <div className="grid gap-1">
                  {navItems.map((item) => (
                    <Link to={item.href}
                      key={item.label}
                      className="rounded-md px-3 py-3 transition hover:bg-zinc-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="block text-sm font-semibold text-white">
                        {item.label}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-zinc-400">
                        {item.description}
                      </span>
                    </Link>
                  ))}

             
             <div className="flex gap-2">

              <Link to="/add-trade" className="flex-1 sm:hidden">
              
                  <button
                    type="button"
                    className="w-full block   my-2 bg-emerald-400 hover:bg-emerald-300 text-black font-semibold py-2 px-4 rounded transition"
                  >
                    New Trade
                  </button>
              </Link>
                  <button
                    type="submit"
                    onClick={() => dispatch(logout())}
                    className="flex-1 sm:w-full my-2 bg-emerald-400 hover:bg-emerald-300 text-black font-semibold py-2 px-4 rounded transition"
                  >
                    Logout
                  </button>

             </div>
                </div>
              </div>
            )}
          </div>
        )}

        {!isAuthenticated && (
          <button className="rounded-lg hidden sm:block bg-emerald-400 px-4 py-2 text-sm font-bold text-zinc-950 transition hover:bg-emerald-300">
            Let's Journal your journey
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
