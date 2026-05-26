// src/components/Navbar/index.tsx
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="flex items-center justify-between px-12 py-6">
      {/* Logo Area */}
      {/* Note: Ensure 'Gveret Levin' font is loaded in your index.css or via a local file */}
      <Link 
        to="/" 
        className="text-primary text-[48px]" 
        style={{ fontFamily: "'Gveret Levin', cursive" }}
      >
        Gatherly
      </Link>

      {/* Navigation Links */}
      <div className="flex gap-24">
        <Link 
          to="/" 
          className={`text-[20px] font-medium text-primary pb-2 ${
            location.pathname === '/' ? 'border-b-4 border-primary' : ''
          }`}
        >
          home
        </Link>
        <Link 
          to="/about" 
          className={`text-[20px] font-medium text-primary pb-2 ${
            location.pathname === '/about' ? 'border-b-4 border-primary' : ''
          }`}
        >
          About us
        </Link>
      </div>

      {/* Authentication Button */}
      <button className="bg-primary text-white text-[20px] font-medium px-6 py-3 rounded-[16px] shadow-[5px_5px_10px_0px_rgba(0,0,0,1)] hover:opacity-90 transition-opacity">
        Sign up | Sign in
      </button>
    </nav>
  );
};

export default Navbar;
