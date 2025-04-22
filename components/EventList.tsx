import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Sun, Moon, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, 
  ChevronDown, ChevronUp, Send, User, Clock, Users, Handshake, Search, Filter, X,
  Menu, Home, Newspaper, Mail, Calendar
} from 'lucide-react';
import Link from 'next/link';
import Separator from './Separator';

// Types
interface Collaborator {
  id: number;
  user_id: string;
  role: string;
  avatar?: string;
  name?: string;
}

interface Comment {
  id: number;
  event_id: number;
  content: string;
  username?: string;
  created_at: string;
  avatar?: string;
}

interface Partner {
  id: number;
  full_name: string;
  offered_help?: string;
  logo?: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  image?: string;
  category_id?: string;
  budget?: string;
  currency_id?: string;
  created_by?: string;
  updated_at?: string;
}

const Navbar: React.FC<{ darkMode: boolean; toggleDarkMode: () => void }> = ({ darkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { name: 'About', href: '/about', icon: <Home size={20} /> },
    { name: 'Actus', href: '/actus', icon: <Newspaper size={20} /> },
    { name: 'Contact', href: '/contact', icon: <Mail size={20} /> },
    { name: 'Events', href: '/event', icon: <Calendar size={20} /> },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 ${darkMode ? 'bg-gray-900/90' : 'bg-white/90'} backdrop-blur-md shadow-lg border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-all duration-300`}>
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-black'} bg-gradient-to-r ${darkMode ? 'from-green-400 to-white' : 'from-green-500 to-black'} bg-clip-text text-transparent`}>
            EventSphere
          </span>
        </Link>

        <div className="hidden md:flex space-x-8 items-center">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-2 ${darkMode ? 'text-white' : 'text-black'} hover:text-green-500 dark:hover:text-green-400 transition-colors duration-300 group`}
            >
              <span className="group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>

        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-all duration-300"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={`flex flex-col items-center space-y-6 py-6 ${darkMode ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'} backdrop-blur-md border-t`}>
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={toggleMenu}
              className={`flex items-center space-x-3 ${darkMode ? 'text-white' : 'text-black'} hover:text-green-500 dark:hover:text-green-400 transition-colors duration-300 animate-fade-in`}
            >
              <span className="text-green-500">{item.icon}</span>
              <span className="text-lg font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    comments: true,
    collaborators: true,
    partners: true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'ongoing' | 'draft' | 'completed'>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setDarkMode(savedTheme === "dark");
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const filtered = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
    setFilteredEvents(filtered);
  }, [events, searchTerm, filterStatus]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3001/api/events');

      if (!Array.isArray(response.data)) {
        console.error('Les données reçues ne sont pas un tableau:', response.data);
        throw new Error('Les données de l\'API ne sont pas au format attendu (tableau requis).');
      }

      const eventsWithImages = response.data.map((event: Event, index: number) => ({
        ...event,
        image: `https://source.unsplash.com/random/600x600/?event,${index}`,
        status: event.status || 'draft' // Ajout d'un statut par défaut si vide
      }));
      setEvents(eventsWithImages);
      setFilteredEvents(eventsWithImages);
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
      setError('Impossible de charger les événements. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (eventId: string) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/event_comments/event/${eventId}`);
      const commentsWithAvatars = response.data.map((comment: Comment) => ({
        ...comment,
        avatar: `https://i.pravatar.cc/150?u=${comment.username || 'anonymous'}`
      }));
      setComments(commentsWithAvatars);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
    }
  };

  const fetchCollaborators = async (eventId: string) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/event_collaborators/event/${eventId}`);
      const collaboratorsWithAvatars = response.data.map((collab: Collaborator) => ({
        ...collab,
        avatar: `https://i.pravatar.cc/150?u=${collab.user_id}`,
        name: `User ${collab.user_id}`
      }));
      setCollaborators(collaboratorsWithAvatars);
    } catch (error) {
      console.error('Erreur lors du chargement des collaborateurs:', error);
    }
  };

  const fetchPartners = async (eventId: string) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/event_partners/event/${eventId}`);
      const partnersWithLogos = response.data.map((partner: Partner) => ({
        ...partner,
        logo: `https://logo.clearbit.com/${partner.full_name.replace(/\s/g, '')}.com`
      }));
      setPartners(partnersWithLogos);
    } catch (error) {
      console.error('Erreur lors du chargement des partenaires:', error);
    }
  };

  const handleShowDetails = (eventId: string) => {
    setSelectedEventId(eventId === selectedEventId ? null : eventId);
    if (eventId !== selectedEventId) {
      fetchComments(eventId);
      fetchCollaborators(eventId);
      fetchPartners(eventId);
    }
  };

  const handlePostComment = async (eventId: string) => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post('http://localhost:3001/api/event_comments', {
        event_id: eventId,
        content: newComment,
      });
      const newCommentWithAvatar = {
        ...response.data,
        avatar: 'https://i.pravatar.cc/150?u=newcomment',
        username: 'Vous'
      };
      setComments([...comments, newCommentWithAvatar]);
      setNewComment('');
    } catch (error) {
      console.error('Erreur lors de la publication du commentaire:', error);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setShowFilters(false);
  };

  const getStatusColorClass = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status) {
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const translateStatus = (status: string) => {
    if (!status) return 'Inconnu';
    switch (status) {
      case 'ongoing':
        return 'En cours';
      case 'draft':
        return 'Brouillon';
      case 'completed':
        return 'Terminé';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Date inconnue';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main className="container mx-auto p-4 pt-24">
        <div className={`mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-md`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
              </div>
              <input
                type="text"
                placeholder="Rechercher des événements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
              >
                <Filter size={18} />
                <span>Filtrer</span>
              </button>
              
              {(searchTerm || filterStatus !== 'all') && (
                <button
                  onClick={resetFilters}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                >
                  <X size={18} />
                  <span>Réinitialiser</span>
                </button>
              )}
            </div>
          </div>
          
          {showFilters && (
            <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <h3 className="font-semibold mb-3">Filtrer par :</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block mb-1 text-sm font-medium">Statut</label>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'ongoing', 'draft', 'completed'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status as 'all' | 'ongoing' | 'draft' | 'completed')}
                        className={`px-3 py-1 text-sm rounded-full ${filterStatus === status 
                          ? 'bg-green-500 text-white' 
                          : darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
                      >
                        {status === 'all' ? 'Tous' : translateStatus(status)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {error ? (
          <div className={`text-center py-12 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
              <X className="text-red-500" size={24} />
            </div>
            <h3 className="text-lg font-medium mb-1">Erreur</h3>
            <p className={`max-w-md mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {error}
            </p>
            <button
              onClick={fetchEvents}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Réessayer
            </button>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div 
                  key={event.id} 
                  className={`rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <div className="flex items-center p-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-black flex items-center justify-center text-white">
                      <User size={20} />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="font-semibold">Organisateur Événement</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatDate(event.start_date)}
                      </p>
                    </div>
                    <button className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                      <MoreHorizontal size={20} />
                    </button>
                  </div>

                  <div className="relative group">
                    <img 
                      src={event.image || 'https://via.placeholder.com/600x600'} 
                      alt={event.title || 'Événement'} 
                      className="w-full h-48 object-cover transition-opacity duration-300 group-hover:opacity-90"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button className="bg-white bg-opacity-80 rounded-full p-2 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Heart size={24} className="text-pink-500" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{event.title || 'Sans titre'}</h3>
                        <p className={`text-sm mt-1 line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {event.description || 'Aucune description'}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColorClass(event.status)}`}>
                        {translateStatus(event.status)}
                      </span>
                    </div>

                    <div className="mt-3 flex justify-between items-center">
                      <div className="flex space-x-3">
                        <button className={`flex items-center space-x-1 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                          <Heart size={18} />
                          <span className="text-xs">1.2k</span>
                        </button>
                        <button className={`flex items-center space-x-1 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                          <MessageCircle size={18} />
                          <span className="text-xs">45</span>
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleShowDetails(event.id)}
                        className={`text-xs px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                      >
                        {selectedEventId === event.id ? 'Masquer' : 'Détails'}
                      </button>
                    </div>
                  </div>

                  {selectedEventId === event.id && (
                    <div className={`px-4 pb-4 animate-fadeIn ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                      <div className="mb-4">
                        <div 
                          className="flex items-center justify-between cursor-pointer py-2"
                          onClick={() => toggleSection('comments')}
                        >
                          <h3 className="text-sm font-semibold flex items-center">
                            <MessageCircle size={16} className="mr-2" />
                            Commentaires
                          </h3>
                          {expandedSections.comments ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                        
                        {expandedSections.comments && (
                          <div className="mt-2 space-y-3 max-h-60 overflow-y-auto">
                            {comments.length === 0 ? (
                              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Aucun commentaire</p>
                            ) : (
                              comments.map((comment) => (
                                <div 
                                  key={comment.id} 
                                  className={`p-2 rounded-lg flex text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                                >
                                  <img 
                                    src={comment.avatar} 
                                    alt={comment.username} 
                                    className="w-6 h-6 rounded-full mr-2"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-baseline">
                                      <p className="font-semibold text-xs mr-2">{comment.username || 'Anonyme'}</p>
                                      <p className={`text-xxs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {formatDate(comment.created_at)}
                                      </p>
                                    </div>
                                    <p className="text-xs mt-1">{comment.content}</p>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                        
                        <div className="mt-2">
                          <div className="flex items-center">
                            <img 
                              src="https://i.pravatar.cc/150?u=currentuser" 
                              alt="Votre avatar" 
                              className="w-6 h-6 rounded-full mr-2"
                            />
                            <div className="flex-1 relative">
                              <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className={`w-full p-2 pr-8 rounded-full text-xs ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                                placeholder="Ajouter un commentaire..."
                                rows={1}
                                style={{ resize: 'none' }}
                              />
                              <button
                                onClick={() => handlePostComment(event.id)}
                                disabled={!newComment.trim()}
                                className={`absolute right-1 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${!newComment.trim() ? 'text-gray-400' : 'text-green-500 hover:text-green-600'}`}
                              >
                                <Send size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div 
                          className="flex items-center justify-between cursor-pointer py-2"
                          onClick={() => toggleSection('collaborators')}
                        >
                          <h3 className="text-sm font-semibold flex items-center">
                            <Users size={16} className="mr-2" />
                            Collaborateurs
                          </h3>
                          {expandedSections.collaborators ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                        
                        {expandedSections.collaborators && (
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {collaborators.length === 0 ? (
                              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Aucun collaborateur</p>
                            ) : (
                              collaborators.map((collab) => (
                                <div 
                                  key={collab.id} 
                                  className={`p-2 rounded-lg flex items-center mout text-xs ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                                >
                                  <img 
                                    src={collab.avatar} 
                                    alt={collab.name} 
                                    className="w-6 h-6 rounded-full mr-2 object-cover"
                                  />
                                  <div>
                                    <p className="font-semibold">{collab.name}</p>
                                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{collab.role}</p>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <div 
                          className="flex items-center justify-between cursor-pointer py-2"
                          onClick={() => toggleSection('partners')}
                        >
                          <h3 className="text-sm font-semibold flex items-center">
                            <Handshake size={16} className="mr-2" />
                            Partenaires
                          </h3>
                          {expandedSections.partners ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                        
                        {expandedSections.partners && (
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {partners.length === 0 ? (
                              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Aucun partenaire</p>
                            ) : (
                              partners.map((partner) => (
                                <div 
                                  key={partner.id} 
                                  className={`p-2 rounded-lg flex items-center text-xs ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                                >
                                  {partner.logo ? (
                                    <img 
                                      src={partner.logo} 
                                      alt={partner.full_name} 
                                      className="w-6 h-6 rounded-full mr-2 object-contain"
                                    />
                                  ) : (
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-black flex items-center justify-center text-white mr-2">
                                      <Handshake size={14} />
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-semibold">{partner.full_name}</p>
                                    {partner.offered_help && (
                                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{partner.offered_help}</p>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredEvents.length === 0 && !loading && (
              <div className={`text-center py-12 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                  <Search className="text-gray-500" size={24} />
                </div>
                <h3 className="text-lg font-medium mb-1">Aucun événement trouvé</h3>
                <p className={`max-w-md mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Essayez d'ajuster votre recherche ou vos filtres pour trouver ce que vous cherchez.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </>
        )}
        <Separator />
      </main>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default EventList;