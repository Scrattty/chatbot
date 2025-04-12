import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Brain, UserCircle } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    setIsAuthenticated(!!user);
    if (user) {
      const userData = JSON.parse(user);
      setCurrentUser(userData);
      setIsAdmin(userData.isAdmin || false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setIsAdmin(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className={`h-8 w-8 transition-colors duration-300 ${scrolled ? 'text-pink-500' : 'text-pink-300'}`} />
            <span className={`text-2xl font-bold transition-colors duration-300 ${scrolled ? 'text-black' : ''}`}>SAMI</span>
          </Link>
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <>
                    <Link 
                      to="/about" 
                      className={`transition-all duration-300 px-4 py-2 rounded-full ${
                        isActive('/about') 
                          ? 'bg-[#7CC5E3] text-white' 
                          : 'hover:bg-[#BAE6F2]/50'
                      }`}
                    >
                      About
                    </Link>
                    <Link 
                      to="/history" 
                      className={`transition-all duration-300 px-4 py-2 rounded-full ${
                        isActive('/history') 
                          ? 'bg-[#7CC5E3] text-white' 
                          : 'hover:bg-[#BAE6F2]/50'
                      }`}
                    >
                      History
                    </Link>
                    <Link 
                      to="/chat" 
                      className={`transition-all duration-300 px-4 py-2 rounded-full ${
                        isActive('/chat') 
                          ? 'bg-[#7CC5E3] text-white' 
                          : 'hover:bg-[#BAE6F2]/50'
                      }`}
                    >
                      New Chat
                    </Link>
                    <Link 
                      to="/feedback" 
                      className={`transition-all duration-300 px-4 py-2 rounded-full ${
                        isActive('/feedback') 
                          ? 'bg-[#7CC5E3] text-white' 
                          : 'hover:bg-[#BAE6F2]/50'
                      }`}
                    >
                      Feedback
                    </Link>
                  </>
                )}
                <Link 
                  to="/profile" 
                  className={`flex items-center gap-2 transition-all duration-300 px-4 py-2 rounded-full ${
                    isActive('/profile') 
                      ? 'bg-[#7CC5E3] text-white' 
                      : 'hover:bg-[#BAE6F2]/50'
                  }`}
                >
                  <UserCircle className="w-5 h-5" />
                  {currentUser?.fullname || 'Profile'}
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="bg-[#7C3AED] text-white px-4 py-2 rounded-full hover:bg-[#6D2AE3] transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/about" 
                  className={`transition-all duration-300 px-4 py-2 rounded-full ${
                    isActive('/about') 
                      ? 'bg-[#7CC5E3] text-white' 
                      : 'hover:bg-[#BAE6F2]/50'
                  }`}
                >
                  About
                </Link>
                <Link 
                  to="/chat" 
                  className={`transition-all duration-300 px-4 py-2 rounded-full ${
                    isActive('/chat') 
                      ? 'bg-[#7CC5E3] text-white' 
                      : 'hover:bg-[#BAE6F2]/50'
                  }`}
                >
                  Chat with SAMI
                </Link>
                <Link 
                  to="/signin" 
                  className={`transition-all duration-300 px-4 py-2 rounded-full ${
                    isActive('/signin') 
                      ? 'bg-[#7CC5E3] text-white' 
                      : 'bg-white hover:bg-gray-100 shadow-sm'
                  }`}
                >
                  Sign In →
                </Link>
                <Link 
                  to="/signup" 
                  className={`transition-all duration-300 px-4 py-2 rounded-full ${
                    isActive('/signup') 
                      ? 'bg-[#7CC5E3] text-white' 
                      : 'bg-white hover:bg-gray-100 shadow-sm'
                  }`}
                >
                  Sign up →
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full"></div>
      </div>
    </nav>
  );
};

export default Navbar;