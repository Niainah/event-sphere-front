import React, { useState } from 'react'
import { Calendar, MapPin, Clock, Star } from 'lucide-react';

import paperTexture from '../public/paper-texture.png';

const EventCard = ({ event, isDarkMode }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      key={event.id}
      className={`relative p-6 rounded-2xl shadow-md overflow-hidden group transition-all duration-300 hover:shadow-xl
        ${isDarkMode ? 'bg-gray-800/95 text-white' : 'bg-white/95 text-gray-900'}`}
      style={{
        backgroundImage: `url(${paperTexture.src})`,
        backgroundBlendMode: isDarkMode ? 'overlay' : 'soft-light',
        border: isDarkMode ? '1px solid rgba(74, 222, 128, 0.15)' : '1px solid rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(10px)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-labelledby={`event-title-${event.id}`}
    >
      <div
        className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 
          ${isHovered ? 'opacity-20' : 'opacity-0'}`}
        style={{
          background: `linear-gradient(135deg, ${isDarkMode ? 'rgba(74, 222, 128, 0.2)' : 'rgba(34, 197, 94, 0.15)'}, transparent)`,
        }}
      />
      {event.trending && (
        <div className="absolute top-4 right-4 flex items-center">
          <Star className="w-4 h-4 text-yellow-400" fill="currentColor" aria-hidden="true" />
          <span className="ml-1 text-xs font-semibold text-yellow-400">TRENDING</span>
        </div>
      )}
      <h3
        id={`event-title-${event.id}`}
        className="text-lg font-semibold group-hover:text-green-500 transition-colors duration-200"
      >
        {event.title}
      </h3>
      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-2 line-clamp-2`}>
        {event.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <div className="flex items-center text-xs bg-green-500/10 px-2.5 py-1 rounded-full">
          <MapPin className="w-3.5 h-3.5 mr-1.5 text-green-500" aria-hidden="true" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center text-xs bg-green-500/10 px-2.5 py-1 rounded-full">
          <Calendar className="w-3.5 h-3.5 mr-1.5 text-green-500" aria-hidden="true" />
          <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <div className="flex items-center text-xs bg-green-500/10 px-2.5 py-1 rounded-full">
          <Clock className="w-3.5 h-3.5 mr-1.5 text-green-500" aria-hidden="true" />
          <span>{event.time}</span>
        </div>
      </div>
    </article>
  );
};
export default EventCard;