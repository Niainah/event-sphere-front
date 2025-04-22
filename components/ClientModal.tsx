import React, { useState } from 'react';
import {  X } from 'lucide-react';

export default function ClientModal({ isOpen, onClose }) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [cin, setCin] = useState('');
    const [occupation, setOccupation] = useState('');
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      const clientData = {
        full_name: fullName,
        email,
        cin,
        occupation,
      };
  
      try {
        const response = await fetch('http://localhost:3001/api/clients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(clientData),
        });
  
        if (response.ok) {
          alert('Client créé avec succès');
          onClose();
        } else {
          alert('Erreur lors de la création du client');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la connexion au serveur');
      }
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full relative">
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100">
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Créer un nouveau client</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nom complet"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              placeholder="CIN"
              value={cin}
              onChange={(e) => setCin(e.target.value)}
              required
              className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              placeholder="Occupation"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
            />
            <button type="submit" className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700">
              Créer le client
            </button>
          </form>
        </div>
      </div>
    );
  }
