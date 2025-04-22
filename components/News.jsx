import React, { useState, useEffect } from 'react';
import { Globe, Calendar, Sun, Moon, Home, Newspaper, Mail, Menu, X } from 'lucide-react';
import Link from 'next/link';
import Separator from '@/components/Separator';
import noir from '../public/noir.png';
import blanc from '../public/blanc.png';
import EventCard from './EventCard';
import Footer from './Footer';
import { create } from 'zustand';

const useThemeStore = create((set) => ({
  isDark: false,
  toggleTheme: () => set((state) => {
    const newIsDark = !state.isDark;
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
    return { isDark: newIsDark };
  }),
  initializeTheme: () => {
    const savedTheme = localStorage.getItem("theme");
    set({ isDark: savedTheme === "dark" });
  },
}));

const eventNews = [
  {
    id: 1,
    title: "International Jazz Festival in Montreal",
    location: "Montreal, Canada",
    date: "2023-06-28",
    time: "19:00",
    category: "Music",
    trending: true,
    description: "The world's largest jazz festival celebrates its 42nd edition with international artists.",
  },
  {
    id: 2,
    title: "Climate Change Conference in Berlin",
    location: "Berlin, Germany",
    date: "2023-07-05",
    time: "09:00",
    category: "Environment",
    trending: false,
    description: "Global experts gather to discuss innovative solutions to climate change.",
  },
  {
    id: 3,
    title: "Contemporary Art Exhibition in Tokyo",
    location: "Tokyo, Japan",
    date: "2023-07-12",
    time: "10:00",
    category: "Art",
    trending: true,
    description: "Explore avant-garde works by emerging Asian artists.",
  },
  {
    id: 4,
    title: "New York Marathon",
    location: "New York, USA",
    date: "2023-11-05",
    time: "08:00",
    category: "Sports",
    trending: false,
    description: "The iconic marathon attracts thousands of runners from around the world.",
  },
];

const Navbar = () => {
  const { isDark, toggleTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { name: 'About', href: '/about', icon: <Home size={18} /> },
    { name: 'Actus', href: '/actus', icon: <Newspaper size={18} /> },
    { name: 'Contact', href: '/contact', icon: <Mail size={18} /> },
    { name: 'Events', href: '/event', icon: <Calendar size={18} /> },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-md transition-all duration-300
        ${scrolled ? 'py-2 shadow-md' : 'py-3'}
        ${isDark ? 'bg-gray-900/90' : 'bg-white/90'}`}
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span
            className={`text-2xl font-bold ${
              isDark ? 'text-white' : 'text-black'
            } bg-gradient-to-r ${
              isDark ? 'from-green-400 to-white' : 'from-green-500 to-black'
            } bg-clip-text text-transparent`}
          >
            EventSphere
          </span>
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative flex items-center space-x-1.5 px-2 py-1.5 group focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
            >
              <span
                className={`transition-colors duration-200 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                } group-hover:text-green-500`}
              >
                {item.icon}
              </span>
              <span
                className={`text-sm font-medium ${
                  isDark ? 'text-gray-200' : 'text-gray-700'
                } group-hover:text-green-500`}
              >
                {item.name}
              </span>
              <span
                className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 transition-all duration-200 group-hover:w-full group-focus:w-full"
              />
            </Link>
          ))}
          <button
            onClick={toggleTheme}
            className={`p-1.5 rounded-full transition-all duration-200 hover:bg-opacity-10 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500
              ${isDark ? 'text-green-400' : 'text-green-600'}`}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
        <div className="md:hidden flex items-center space-x-3">
          <button
            onClick={toggleTheme}
            className={`p-1.5 rounded-full transition-all duration-200 hover:bg-opacity-10 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500
              ${isDark ? 'text-green-400' : 'text-green-600'}`}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={toggleMenu}
            className={`p-1.5 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500
              ${isDark ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-green-600 text-white hover:bg-green-700'}`}
            aria-label={`${isOpen ? 'Close' : 'Open'} menu`}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden
          ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        aria-hidden={!isOpen}
      >
        <div
          className={`flex flex-col items-center space-y-4 py-4 backdrop-blur-md
            ${isDark ? 'bg-gray-900/95' : 'bg-white/95'}`}
        >
          {navItems.map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={toggleMenu}
              className="flex items-center space-x-2 px-4 py-1.5 rounded-full transition-all duration-200 hover:bg-green-500/10 focus:outline-none focus:ring-2 focus:ring-green-500"
              style={{
                animation: isOpen ? `fadeInUp 0.3s ease-out ${index * 0.05}s both` : 'none',
              }}
            >
              <span className={`${isDark ? 'text-green-400' : 'text-green-600'}`}>{item.icon}</span>
              <span
                className={`text-base font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default function News() {
  const { isDark, initializeTheme } = useThemeStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`min-h-screen bg-fixed bg-no-repeat bg-cover bg-center transition-all duration-500 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}
      style={{
        backgroundImage: `linear-gradient(to bottom, ${
          isDark ? 'rgba(17, 24, 39, 0.7)' : 'rgba(249, 250, 251, 0.7)'
        }), url(${isDark ? noir.src : blanc.src})`,
        backgroundBlendMode: 'overlay',
      }}
    >
      <style jsx global>{`
        :root {
          --green-500: #22c55e;
          --green-600: #16a34a;
          --teal-500: #14b8a6;
          --gray-900: #111827;
          --gray-50: #f9fafb;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
      <Navbar />
      <Separator />
      <main
        className={`max-w-5xl mx-auto px-4 sm:px-6 py-12 pt-20 transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center space-x-2 animate-float">
            <Globe
              className={`w-7 h-7 ${isDark ? 'text-green-400' : 'text-green-600'} transition-colors duration-300`}
              aria-hidden="true"
            />
            <h1
              className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r 
                ${isDark ? 'from-green-400 to-teal-300' : 'from-green-600 to-teal-500'}`}
            >
              Event News
            </h1>
          </div>
        </header>
        <div className="grid gap-6 sm:grid-cols-2">
          {eventNews.map((event, index) => (
            <div
              key={event.id}
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
              }}
            >
              <EventCard event={event} isDarkMode={isDark} />
            </div>
          ))}
        </div>
      </main>
      <Separator />
      <Footer />
    </div>
  );
}