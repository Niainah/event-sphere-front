import React, { useEffect, useState } from 'react';
import {  X } from 'lucide-react';

export default function EventModal({ isOpen, onClose }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [location, setLocation] = useState('');
    const [status, setStatus] = useState('draft');
    const [budget, setBudget] = useState('');
    const [currencyId, setCurrencyId] = useState('');
    const [createdBy, setCreatedBy] = useState('1'); 
    
    const [currencies, setCurrencies] = useState([]);
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
      if (isOpen) {
        const fetchSelectData = async () => {
          setIsLoading(true);
          try {
            const [currenciesRes, categoriesRes, usersRes] = await Promise.all([
              fetch('http://localhost:3001/api/currencies'),
              fetch('http://localhost:3001/api/event_categories'),
              fetch('http://localhost:3001/api/users')
            ]);
  
            const currenciesData = await currenciesRes.json();
            const categoriesData = await categoriesRes.json();
            const usersData = await usersRes.json();
  
            setCurrencies(currenciesData);
            setCategories(categoriesData);
            setUsers(usersData);
  
            if (currenciesData.length > 0) setCurrencyId(currenciesData[0].id.toString());
            if (categoriesData.length > 0) setCategoryId(categoriesData[0].id.toString());
            if (usersData.length > 0) setCreatedBy(usersData[0].id.toString());
  
          } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
          } finally {
            setIsLoading(false);
          }
        };
  
        fetchSelectData();
      }
    }, [isOpen]);
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      
      const eventData = {
        title,
        description,
        category_id: parseInt(categoryId),
        start_date: startDate,
        end_date: endDate,
        location,
        status,
        budget: budget ? parseFloat(budget) : null,
        currency_id: parseInt(currencyId),
        created_by: parseInt(createdBy)
      };
  
      try {
        const response = await fetch('http://localhost:3001/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData),
        });
  
        if (response.ok) {
          alert('Événement créé avec succès');
          onClose(); 
        } else {
          const errorData = await response.json();
          alert(`Erreur: ${errorData.error || 'Lors de la création de l\'événement'}`);
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la connexion au serveur');
      }
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
          <button 
            onClick={onClose} 
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
          >
            <X size={24} />
          </button>
          
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Créer un nouvel événement</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium dark:text-gray-300">Titre *</label>
                <input
                  type="text"
                  placeholder="Titre de l'événement"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
  
              <div>
                <label className="block mb-1 text-sm font-medium dark:text-gray-300">Description *</label>
                <textarea
                  placeholder="Description détaillée"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={3}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
  
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium dark:text-gray-300">Catégorie *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
  
                <div>
                  <label className="block mb-1 text-sm font-medium dark:text-gray-300">Statut *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  >
                    <option value="draft">Brouillon</option>
                    <option value="published">Publié</option>
                    <option value="ongoing">En cours</option>
                    <option value="completed">Terminé</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                </div>
              </div>
  
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium dark:text-gray-300">Date de début *</label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>
  
                <div>
                  <label className="block mb-1 text-sm font-medium dark:text-gray-300">Date de fin *</label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>
              </div>
  
              <div>
                <label className="block mb-1 text-sm font-medium dark:text-gray-300">Lieu *</label>
                <input
                  type="text"
                  placeholder="Adresse ou lieu de l'événement"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
  
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium dark:text-gray-300">Budget</label>
                  <div className="flex">
                    <select
                      value={currencyId}
                      onChange={(e) => setCurrencyId(e.target.value)}
                      className="w-1/3 p-2 border rounded-l dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    >
                      {currencies.map((currency) => (
                        <option key={currency.id} value={currency.id}>
                          {currency.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Montant"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      min="0"
                      step="0.01"
                      className="w-2/3 p-2 border-t border-b border-r rounded-r dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                  </div>
                </div>
  
                <div>
                  <label className="block mb-1 text-sm font-medium dark:text-gray-300">Créé par *</label>
                  <input type="text" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder='Your name'/>
                </div>
              </div>
  
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                >
                  Créer l'événement
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
}
