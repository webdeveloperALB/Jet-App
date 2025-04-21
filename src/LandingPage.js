import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { Link } from "react-router-dom";
import { Plane, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";
import Navbar from "./components/Navbar";
import Advertisement from "./components/Advertisement";
import SignInForm from "./components/SignInForm";
import MemberForm from "./components/MemberForm";
import JetBookingForm from "./components/JetBookingForm";
import AboutUs from "./components/AboutUs";
import ContactForm from "./components/ContactForm";

export default function LandingPage() {
  const [signedIn, setSignedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isExistingMember, setIsExistingMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const currentYear = new Date().getFullYear();

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(true);
      if (user) {
        // User is signed in
        setSignedIn(true);
        setUsername(user.displayName || user.email.split('@')[0]);
      } else {
        // User is signed out
        setSignedIn(false);
        setUsername("");
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Handle user sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // signOut() will trigger the onAuthStateChanged listener above
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar
        signedIn={signedIn}
        username={username}
        onSignOut={handleSignOut}
      />

      <main className="flex-1">
        <div className="bg-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Experience Luxury Air Travel
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                Book private jets to any destination worldwide with our premium charter service
              </p>
            </div>
          </div>
        </div>

        <Advertisement />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Network</h3>
              <p className="text-gray-600">Access to over 1000+ private airports worldwide</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Service</h3>
              <p className="text-gray-600">Round-the-clock support from our dedicated team</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Luxury Fleet</h3>
              <p className="text-gray-600">Choose from our premium selection of private jets</p>
            </div>
          </div>

          {!signedIn ? (
            <div id="sign-in-section" className="max-w-2xl mx-auto bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-100 scroll-mt-24 my-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Welcome to JetPage</h2>
                <p className="mt-2 text-gray-600">Your premium private jet booking platform</p>
              </div>

              {/* Account Type Toggle */}
              <div className="flex justify-center mb-8">
                <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                  <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${!isExistingMember
                      ? 'bg-white text-gray-900 shadow'
                      : 'text-gray-500 hover:text-gray-900'
                      }`}
                    onClick={() => setIsExistingMember(false)}
                  >
                    New Member
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isExistingMember
                      ? 'bg-white text-gray-900 shadow'
                      : 'text-gray-500 hover:text-gray-900'
                      }`}
                    onClick={() => setIsExistingMember(true)}
                  >
                    Existing Member
                  </button>
                </div>
              </div>

              {isExistingMember ? (
                <>
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Sign In to Your Account</h3>
                    <p className="mt-2 text-gray-600">Welcome back to JetPage</p>
                  </div>
                  <MemberForm
                    setUsername={setUsername}
                    setSignedIn={setSignedIn}
                    onToggleForm={() => setIsExistingMember(false)}
                  />
                </>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Create Your Account</h3>
                    <p className="mt-2 text-gray-600">Join our elite membership today</p>
                  </div>
                  <SignInForm
                    username={username}
                    setUsername={setUsername}
                    setSignedIn={setSignedIn}
                    onToggleForm={() => setIsExistingMember(true)}
                  />
                </>
              )}
            </div>
          ) : (
            <JetBookingForm username={username} />
          )}
        </div>

        {/* About Us Section */}
        <div id="about-section" className="scroll-mt-16">
          <AboutUs />
        </div>

        {/* Contact Section */}
        <div id="contact-section" className="scroll-mt-16">
          <ContactForm />
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-white border-t border-gray-200">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Top section with logo and description */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-8 border-b border-gray-100">
            <div className="flex items-center mb-6 md:mb-0">
              <Plane className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">JetPage</span>
            </div>
            <p className="text-gray-600 max-w-md">
              Premium private jet charter services for business and leisure travel worldwide.
            </p>
          </div>
          
          {/* Footer Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 gap-y-10">
            {/* About Us Column */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About Us</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/our-story" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link to="/team" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Team
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/press" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Press Releases
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Services Column */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Services</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/private-jets" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Private Jets
                  </Link>
                </li>
                <li>
                  <Link to="/corporate-travel" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Corporate Travel
                  </Link>
                </li>
                <li>
                  <Link to="/group-charters" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Group Charters
                  </Link>
                </li>
                <li>
                  <Link to="/vip-services" className="text-gray-600 hover:text-blue-600 transition-colors">
                    VIP Services
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Support Column */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/faqs" className="text-gray-600 hover:text-blue-600 transition-colors">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Connect Column */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect</h3>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <a href="mailto:info@jetpage.com" className="text-gray-600 hover:text-blue-600 transition-colors">
                    info@jetpage.com
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <a href="tel:+18001234567" className="text-gray-600 hover:text-blue-600 transition-colors">
                    +1 (800) 123-4567
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-600">New York, NY</span>
                </div>
                
                {/* Social Media Icons */}
                <div className="flex items-center space-x-4 mt-4 pt-2">
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
                    <Twitter className="h-6 w-6" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700 transition-colors">
                    <Linkedin className="h-6 w-6" />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors">
                    <Instagram className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Copyright Bar */}
        <div className="bg-gray-50 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
              <p>&copy; {currentYear} JetPage. All rights reserved.</p>
              <div className="flex space-x-8 mt-4 md:mt-0">
                <Link to="/terms" className="hover:text-blue-600 transition-colors">Terms</Link>
                <Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy</Link>
                <Link to="/cookies" className="hover:text-blue-600 transition-colors">Cookies</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}