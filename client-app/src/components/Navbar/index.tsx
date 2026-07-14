import { useState, useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X as CloseIcon } from 'lucide-react';
import Button from '../Button';
import { useStore } from '../../stores/rootStore';

const Navbar = observer(() => {
  const { authStore, eventStore } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isAbout = location.pathname === '/about';
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Collapse the mobile menu whenever the route changes (e.g. tapping a tab).
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await authStore.logout();
    // events were loaded while authenticated (isHost/isGoing computed for that user) —
    // re-fetch now that the JWT is gone so the homepage reflects the anonymous view
    // immediately instead of requiring a manual refresh.
    eventStore.loadEvents();
    navigate('/');
  };

  return (
    <nav
      id="main-navbar"
      className="bg-[#F3F4F6] py-4 md:py-8 px-4 sm:px-8 md:px-16 border-b border-gray-200 sticky top-0 z-[9999]"
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div
          className="text-[32px] md:text-[48px] font-normal text-[#078C80] tracking-tight cursor-pointer"
          style={{ fontFamily: '"Gveret Levin", cursive' }}
          onClick={() => navigate('/')}
        >
          Gatherly
        </div>

        {/* Tabs — desktop only */}
        <div className="hidden md:flex items-center gap-[40px]">
          <div className="relative flex flex-col items-center w-[240px]">
            <a href="/" className="text-[#078C80] text-[24px] font-medium pb-4 hover:opacity-80 transition-opacity">
              home
            </a>
            <div className={`absolute bottom-0 w-[240px] h-[4px] bg-[#078C80] transition-opacity ${isAbout ? 'opacity-0' : 'opacity-100'}`} />
          </div>
          <div className="relative flex flex-col items-center w-[240px]">
            <a href="/about" className="text-[#078C80] text-[24px] font-medium pb-4 hover:opacity-80 transition-opacity">
              About us
            </a>
            <div className={`absolute bottom-0 w-[240px] h-[4px] bg-[#078C80] transition-opacity ${isAbout ? 'opacity-100' : 'opacity-0'}`} />
          </div>
        </div>

        {/* Auth Section — desktop only */}
        <div className="hidden md:block">
          {authStore.isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              {/* User avatar + name button */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <img
                  src={
                    authStore.user?.imageUrl ||
                    `https://placehold.co/100x100/e2e8f0/64748b?text=${authStore.user?.displayName?.charAt(0) ?? 'U'}`
                  }
                  alt="avatar"
                  className="w-[44px] h-[44px] rounded-full object-cover border-2 border-[#078C80]"
                />
                <span dir="auto" className="text-[#078C80] text-[20px] font-medium">
                  {authStore.user?.displayName}
                </span>
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-[200px] bg-white rounded-[16px] shadow-lg border border-gray-100 overflow-hidden z-50">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate(`/profile/${authStore.user?.id}`);
                    }}
                    className="w-full text-left px-5 py-3 text-[16px] text-[#1F2937] hover:bg-teal-50 transition-colors flex items-center gap-3"
                  >
                    <svg className="w-5 h-5 text-[#078C80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/events/create');
                    }}
                    className="w-full text-left px-5 py-3 text-[16px] text-[#1F2937] hover:bg-teal-50 transition-colors flex items-center gap-3"
                  >
                    <svg className="w-5 h-5 text-[#078C80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Event
                  </button>
                  <div className="border-t border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-3 text-[16px] text-red-500 hover:bg-red-50 transition-colors flex items-center gap-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              onClick={() => navigate('/signin')}
              className="!w-auto !h-auto !py-3 !px-8 !text-[20px] !font-medium !rounded-[16px] !bg-[#078C80] hover:!bg-[#06756b] !text-[#FFFFFF] !border-none !shadow-none"
            >
              Sign up | Sign in
            </Button>
          )}
        </div>

        {/* Hamburger — mobile only */}
        <button
          onClick={() => setMobileMenuOpen(o => !o)}
          className="md:hidden text-[#078C80] p-2 -mr-2"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <CloseIcon size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 pb-2">
          <a href="/" className={`text-[18px] font-medium ${isAbout ? 'text-[#1F2937]' : 'text-[#078C80]'}`}>
            home
          </a>
          <a href="/about" className={`text-[18px] font-medium ${isAbout ? 'text-[#078C80]' : 'text-[#1F2937]'}`}>
            About us
          </a>
          <div className="border-t border-gray-200 pt-4">
            {authStore.isLoggedIn ? (
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => navigate(`/profile/${authStore.user?.id}`)}
                  className="flex items-center gap-3"
                >
                  <img
                    src={
                      authStore.user?.imageUrl ||
                      `https://placehold.co/100x100/e2e8f0/64748b?text=${authStore.user?.displayName?.charAt(0) ?? 'U'}`
                    }
                    alt="avatar"
                    className="w-[40px] h-[40px] rounded-full object-cover border-2 border-[#078C80]"
                  />
                  <span dir="auto" className="text-[#078C80] text-[18px] font-medium">
                    {authStore.user?.displayName}
                  </span>
                </button>
                <button
                  onClick={() => navigate('/events/create')}
                  className="text-left text-[16px] text-[#1F2937]"
                >
                  Create Event
                </button>
                <button
                  onClick={handleLogout}
                  className="text-left text-[16px] text-red-500"
                >
                  Log out
                </button>
              </div>
            ) : (
              <Button
                onClick={() => navigate('/signin')}
                className="!w-full !h-auto !py-3 !px-8 !text-[18px] !font-medium !rounded-[16px] !bg-[#078C80] hover:!bg-[#06756b] !text-[#FFFFFF] !border-none !shadow-none"
              >
                Sign up | Sign in
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
});

export default Navbar;