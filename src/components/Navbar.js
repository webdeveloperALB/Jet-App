import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plane, Menu, X } from 'lucide-react';

export default function Navbar({ signedIn, username, onSignOut }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const section = document.querySelector(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <Plane className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
              <span className="ml-2 text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">JetPage</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('#about-section')}
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('#contact-section')}
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Contact
            </button>
            
            {/* Auth Section */}
            {signedIn ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">Welcome, {username}</span>
                <button
                  onClick={onSignOut}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 font-medium transition-all hover:shadow-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => scrollToSection('#sign-in-section')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium transition-all hover:shadow-md"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2">
          <div className="px-4 pt-2 pb-3 space-y-4">
            <button
              onClick={() => scrollToSection('#about-section')}
              className="block w-full text-left py-2 text-gray-600 hover:text-blue-600 font-medium"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('#contact-section')}
              className="block w-full text-left py-2 text-gray-600 hover:text-blue-600 font-medium"
            >
              Contact
            </button>
            
            {/* Auth in Mobile Menu */}
            {signedIn ? (
              <div className="pt-2 border-t border-gray-100">
                <div className="py-2 text-gray-700 font-medium">Welcome, {username}</div>
                <button
                  onClick={onSignOut}
                  className="mt-2 w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => scrollToSection('#sign-in-section')}
                className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}