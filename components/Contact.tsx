import React, { useEffect } from 'react';
import { Menu, X, Home, Newspaper, Mail, Calendar, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { create } from 'zustand';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { EnvelopeIcon, UserIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import Separator from './Separator';
import Footer from './Footer';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

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

const Navbar = () => {
  const { isDark, toggleTheme } = useThemeStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
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
          <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'} bg-gradient-to-r ${isDark ? 'from-green-400 to-white' : 'from-green-500 to-black'} bg-clip-text text-transparent`}>
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
              <span className={`transition-colors duration-200 ${isDark ? 'text-gray-300' : 'text-gray-700'} group-hover:text-green-500`}>
                {item.icon}
              </span>
              <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} group-hover:text-green-500`}>
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
              <span className={`text-base font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default function Contact() {
  const { isDark, initializeTheme } = useThemeStore();

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(contactSchema) });

  const onSubmit = (data) => {
    console.log(data);
    reset();
    alert('Form submitted successfully!');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-300`}>
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <div className={`max-w-md mx-auto ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
          <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Contact Us</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative">
              <UserIcon className={`absolute left-3 top-3 h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                {...register('name')}
                type="text"
                placeholder="Your Name"
                className={`w-full pl-10 pr-3 py-2 rounded-md border ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div className="relative">
              <EnvelopeIcon className={`absolute left-3 top-3 h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                {...register('email')}
                type="email"
                placeholder="Your Email"
                className={`w-full pl-10 pr-3 py-2 rounded-md border ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div className="relative">
              <ChatBubbleLeftIcon className={`absolute left-3 top-3 h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <textarea
                {...register('message')}
                placeholder="Your Message"
                rows={4}
                className={`w-full pl-10 pr-3 py-2 rounded-md border ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
      <Separator />
      <Footer />
      <Separator />
    </div>
  );
}