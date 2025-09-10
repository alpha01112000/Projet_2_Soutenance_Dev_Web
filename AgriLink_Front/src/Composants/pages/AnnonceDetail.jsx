import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../Header';

const AnnonceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [annonce, setAnnonce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // Get user role from localStorage
  const userRole = localStorage.getItem('userRole');
  const isProducer = userRole === 'producteur';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAnnonce = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/annonces/${id}`);
        setAnnonce(response.data);
        setError(null);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'annonce:', error);
        setError('Erreur lors du chargement de l\'annonce');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnonce();
  }, [id]);

  const handleOpenMessageModal = () => {
    if (!token) {
      alert('Veuillez vous connecter pour envoyer un message.');
      navigate('/login');
      return;
    }
    if (isProducer) {
      alert('Les producteurs ne peuvent pas contacter d\'autres producteurs.');
      return;
    }
    setShowMessageModal(true);
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim()) {
      alert('Veuillez saisir un message.');
      return;
    }

    setSendingMessage(true);
    try {
      const tokenLocal = localStorage.getItem('token');
      await axios.post('/api/messages', {
        annonce: id,
        contenu: messageContent
      }, {
        headers: {
          Authorization: `Bearer ${tokenLocal}`,
        },
      });
      alert('Message envoyé avec succès !');
      setShowMessageModal(false);
      setMessageContent('');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      alert('Erreur lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="font-sans text-gray-900">
        <Header />
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">Chargement de l'annonce...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-sans text-gray-900">
        <Header />
        <div className="text-center py-10">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!annonce) {
    return (
      <div className="font-sans text-gray-900">
        <Header />
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">Annonce non trouvée.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans text-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-green-900 text-white h-96 flex items-center justify-center">
        <img
          src="/src/assets/creer une annonce.png"
          alt="Contact background"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="relative bg-opacity-70 rounded-lg p-8 max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold mb-6 drop-shadow-lg">{annonce.titre}</h1>
          <p className="text-xl mb-8 drop-shadow-md">{annonce.description}</p>
        </div>
      </section>

      {/* Annonce Details */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {annonce.images && annonce.images.length > 0 && (
              <img
                src={`http://localhost:3000${annonce.images[0]}`}
                alt={annonce.titre}
                className="w-full h-64 object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.src = '/src/assets/default-product.png';
                }}
              />
            )}
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">{annonce.titre}</h2>
            <p className="text-gray-700 mb-4">{annonce.description}</p>
            <p className="text-2xl font-semibold text-green-700 mb-4">{annonce.prix} GNF / unité</p>
            <p className="text-gray-600 mb-4">Quantité disponible: {annonce.quantite}</p>
            <p className="text-gray-600 mb-4">Localisation: {annonce.localisation?.ville}, {annonce.localisation?.region}</p>
            <p className="text-gray-600 mb-4">Contact: {annonce.contact?.nom} - {annonce.contact?.email}</p>
            {!isProducer && (
              <button
                onClick={handleOpenMessageModal}
                className="bg-yellow-400 text-green-900 font-semibold px-6 py-3 rounded shadow hover:bg-yellow-500 transition"
              >
                Contacter le vendeur
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Envoyer un message au vendeur</h3>
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Votre message..."
              className="w-full h-32 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setShowMessageModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleSendMessage}
                disabled={sendingMessage}
                className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600 transition disabled:opacity-50"
              >
                {sendingMessage ? 'Envoi...' : 'Envoyer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#EBE9E9] border-t border-gray-300 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between">
          <div>
            <img src="/src/assets/logo.png" alt="AgriLink Logo" className="h-10 w-10 mb-2" />
            <p className="text-gray-600 text-sm">
              Reconnecter l'agriculture locale,
              <br />
              Nous travaillons à créer un avenir <br /> dans lequel les agriculteurs cultivent davantage, <br />
              gagnent davantage et où les communautés locales mangent mieux chaque jour.
            </p>
          </div>
          <div className="flex space-x-12 mt-6 md:mt-0">
            <div>
              <h4 className="font-semibold mb-2">Liens utiles</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li><Link to="/apropos" className="hover:text-green-700">À propos</Link></li>
                <li><Link to="/annonces" className="hover:text-green-700">Explorer les annonces</Link></li>
                <li><Link to="/faq" className="hover:text-green-700">FAQ</Link></li>
                <li><Link to="/contact" className="hover:text-green-700">Contact</Link></li>
              </ul>
            </div>
            <div className="text-gray-600 text-sm">
              <p>AgriLink — Reconnecter l'agriculture locale.</p>
              <p>©️ 2025 AgriLink. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AnnonceDetail;
