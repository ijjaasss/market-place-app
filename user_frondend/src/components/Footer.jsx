// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import {  Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-brand-light pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & About */}
          <div className="space-y-4">
            <Link to="/" className="text-3xl font-black text-white tracking-tight block">
              Market place<span className="text-brand-orange">.</span>
            </Link>
            <p className="text-brand-light/80 text-sm leading-relaxed mt-4">
              Your one-stop destination for premium quality products. We bring the best of the marketplace directly to your doorstep with secure payments and fast delivery.
            </p>

          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-brand-orange -mb-2"></span>
            </h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-brand-light/80 hover:text-brand-orange transition-colors">Home</Link></li>
              <li><Link to="/products" className="text-brand-light/80 hover:text-brand-orange transition-colors">Shop Products</Link></li>
              <li><Link to="/categories" className="text-brand-light/80 hover:text-brand-orange transition-colors">All Categories</Link></li>
              <li><Link to="/cart" className="text-brand-light/80 hover:text-brand-orange transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Customer Service
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-brand-olive -mb-2"></span>
            </h3>
            <ul className="space-y-3">
              <li><Link to="/profile" className="text-brand-light/80 hover:text-brand-orange transition-colors">My Account</Link></li>
              <li><Link to="/orders" className="text-brand-light/80 hover:text-brand-orange transition-colors">Track Order</Link></li>
              <li><Link to="/wishlist" className="text-brand-light/80 hover:text-brand-orange transition-colors">Wishlist</Link></li>
              <li><a href="#" className="text-brand-light/80 hover:text-brand-orange transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Contact Us
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-brand-orange -mb-2"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-brand-olive mt-0.5" />
                <span className="text-brand-light/80 text-sm">123 Marketplace Avenue, Tech District, City 10001</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-brand-olive" />
                <span className="text-brand-light/80 text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-brand-olive" />
                <span className="text-brand-light/80 text-sm">support@example.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-brand-light/60">
          <p>&copy; {currentYear}  Marketplace. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span>Secure Payments</span>
            <span className="font-black italic text-white/40">STRIPE</span>
            <span className="font-black italic text-white/40">PAYPAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}