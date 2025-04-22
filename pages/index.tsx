import Image from "next/image";
import { useState, useEffect } from "react";
import { Sun, Moon, ArrowRight, Users, Heart, Calendar, Mail } from "lucide-react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setDarkMode(savedTheme === "dark" ? true : false);
  }, []);

  // Toggle theme and save to localStorage
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  const icons = [Users, Heart, Calendar, Mail];

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-between p-6 sm:p-12 lg:p-24 transition-all duration-500 font-[Poppins] ${
        darkMode
          ? "bg-black text-white"
          : "bg-gray-100 text-black"
      }`}
    >
      <div className="w-full max-w-5xl flex items-center justify-between z-10">
        <div
          className={`fixed left-0 top-0 w-full flex justify-center py-8 px-4 backdrop-blur-md lg:static lg:w-auto lg:rounded-2xl lg:p-4 animate-in slide-in-from-top-4 duration-700 ${
            darkMode
              ? "bg-gradient-to-b from-[#1a3c34]/90 to-transparent"
              : "bg-gradient-to-b from-[#1a3c34]/70 to-transparent"
          }`}
        >
          <p className="text-sm sm:text-base flex items-center gap-2">
          <span className={`font-bold ${darkMode ? "text-green-300 hover:text-green-200" : "text-black hover:text-gray-800"} transition-colors duration-300`}>
            EventSphere
          </span>
          </p>
        </div>
        <div className="fixed bottom-0 left-0 w-full flex items-center justify-center py-6 lg:static lg:p-0 animate-in slide-in-from-bottom-4 duration-700">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
              darkMode
                ? "bg-[#1a3c34]/80 hover:bg-[#1a3c34]"
                : "bg-[#1a3c34]/60 hover:bg-[#1a3c34]/80"
            }`}
          >
            {darkMode ? (
              <Sun className="w-6 h-6 text-white" />
            ) : (
              <Moon className="w-6 h-6 text-black" />
            )}
          </button>
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 ml-4 hover:translate-x-2 transition-transform duration-300"
          >
            By{" "}
            <Image
            src="/logo.png"
            alt="Logo"
            width={100}
            height={24}
          />
          </a>
        </div>
      </div>

      <div className="relative flex items-center my-12">
        <div
          className={`absolute inset-0 -z-10 h-[300px] w-[300px] rounded-full blur-3xl animate-pulse opacity-50 lg:h-[400px] lg:w-[400px] ${
            darkMode ? "bg-[#1a3c34]/30" : "bg-[#1a3c34]/20"
          }`}
        />
        <Image
          src="/eventSphere.png"
          alt="eventSphere Logo"
          width={220}
          height={45}
          className="rounded-lg shadow-xl hover:scale-105 hover:rotate-1 transition-all duration-500 ease-in-out"
        />
      </div>

      <div className="grid gap-6 w-full max-w-5xl mb-12 lg:grid-cols-4">
        {[
          { href: "/about", title: "About", desc: "Discover who we are and what drives us" },
          { href: "/actus", title: "Actus", desc: "Explore our community support services" },
          { href: "/event", title: "Events", desc: "Join our exciting upcoming events" },
          { href: "/contact", title: "Contact", desc: "Reach out with questions or ideas" },
        ].map((item, index) => {
          const Icon = icons[index];
          return (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group p-6 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl animate-in fade-in zoom-in-95 ${
                darkMode
                  ? "bg-[#1a3c34]/40 hover:bg-[#1a3c34]/70"
                  : "bg-[#1a3c34]/20 hover:bg-[#1a3c34]/40"
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-3">
                <Icon className="w-6 h-6 text-green-300 group-hover:scale-110 transition-transform duration-300" />
                {item.title}
                <ArrowRight className="w-5 h-5 text-green-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300" />
              </h2>
              <p
                className={`mt-2 text-sm transition-all duration-300 ${
                  darkMode ? "text-gray-300 group-hover:text-white" : "text-gray-700 group-hover:text-black"
                }`}
              >
                {item.desc}
              </p>
            </a>
          );
        })}
      </div>
    </main>
  );
}