import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Phone, MapPin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white pt-16 pb-8 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-6 transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-pulse">
              EventSphere
            </h2>
            <p className="text-gray-300 leading-relaxed max-w-xs">
              Discover unforgettable events worldwide. We ignite passion and create memories that last a lifetime.
            </p>
            <div className="flex space-x-6">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-gray-400 hover:text-green-400 transform hover:-translate-y-1 transition-all duration-300"
                  aria-label={`Social media link ${index + 1}`}
                >
                  <Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 text-green-400 border-b border-green-400/30 pb-2">
              Explore
            </h3>
            <ul className="space-y-4">
              {['About', 'Actus', 'Event', 'Contact'].map((item, index) => (
                <li key={index}>
                  <a
                    href={`/${item.toLowerCase()}`}
                    className="text-gray-300 hover:text-white hover:pl-2 transition-all duration-300 relative before:content-[''] before:absolute before:left-0 before:top-1/2 before:h-0.5 before:w-0 before:bg-green-400 before:transition-all before:duration-300 hover:before:w-2"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 text-green-400 border-b border-green-400/30 pb-2">
              Get in Touch
            </h3>
            <ul className="space-y-6">
              <li className="flex items-start space-x-3 group">
                <MapPin className="w-6 h-6 text-green-400 mt-1 group-hover:animate-bounce" />
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  123 Rue des Événements, Antananarivo, Madagascar
                </span>
              </li>
              <li className="flex items-center space-x-3 group">
                <Mail className="w-6 h-6 text-green-400 group-hover:animate-pulse" />
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  contact@eventworld.com
                </span>
              </li>
              <li className="flex items-center space-x-3 group">
                <Phone className="w-6 h-6 text-green-400 group-hover:animate-pulse" />
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  +33 1 23 45 67 89
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-green-400 border-b border-green-400/30 pb-2">
              Stay Updated
            </h3>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter for the latest events and updates.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-400 text-gray-900 px-4 py-1 rounded-md hover:bg-green-300 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} EventWorld. All rights reserved.
          </p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            {['Privacy Policy', 'Terms of Use'].map((item, index) => (
              <a
                key={index}
                href="#"
                className="text-gray-400 hover:text-green-400 text-sm transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-green-400 after:transition-all hover:after:w-full"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}