import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Header';

const Annonces = () => {
  const navigate = useNavigate();
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedAnnonce, setSelectedAnnonce] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // Filtered annonces
  const filteredAnnonces = useMemo(() => {
    return annonces.filter((annonce) => {
      const matchesSearch = searchTerm === '' ||
        annonce.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        annonce.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '' || selectedCategory === 'Catégorie' ||
        annonce.categorie?.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesLocation = selectedLocation === '' || selectedLocation === 'Localisation' ||
        (annonce.localisation?.region?.toLowerCase().includes(selectedLocation.toLowerCase()) ||
         annonce.localisation?.ville?.toLowerCase().includes(selectedLocation.toLowerCase()));
      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [annonces, searchTerm, selectedCategory, selectedLocation]);

  // Get user role from localStorage
  const userRole = localStorage.getItem('userRole');
  const isProducer = userRole === 'producteur';
  const isLoggedIn = localStorage.getItem('token');

  // Handle opening message modal
  const handleOpenMessageModal = (annonce) => {
    if (!isLoggedIn) {
      alert('Veuillez vous connecter pour contacter le vendeur.');
      navigate('/login');
      return;
    }
    if (isProducer) {
      alert('Les producteurs ne peuvent pas contacter d\'autres vendeurs.');
      return;
    }
    setSelectedAnnonce(annonce);
    setShowMessageModal(true);
  };

  // Handle sending message
  const handleSendMessage = async () => {
    if (!messageContent.trim()) {
      alert('Veuillez saisir un message.');
      return;
    }

    setSendingMessage(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/contact', {
        annonceId: selectedAnnonce._id,
        content: messageContent
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert('Message envoyé avec succès !');
      setShowMessageModal(false);
      setMessageContent('');
      setSelectedAnnonce(null);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      alert('Erreur lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
      setSendingMessage(false);
    }
  };

  useEffect(() => {
    const fetchAnnonces = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/annonces');
        setAnnonces(response.data || []);
        setError(null);
      } catch (error) {
        console.error('Erreur lors de la récupération des annonces:', error);
        setError('Erreur lors du chargement des annonces');
        setAnnonces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnonces();
  }, []);

  return (
    <div className="font-sans text-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-green-900 text-white h-80 md:h-130 flex items-center justify-center">
        <img
          src="/src/assets/creer une annonce.png"
          alt="Contact background"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="relative bg-opacity-70 rounded-lg p-6 md:p-8 max-w-3xl text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 md:mb-6 drop-shadow-lg">Explorer les annonces</h1>
          <p className="text-lg md:text-xl mb-6 md:mb-8 drop-shadow-md px-4">
            Parcourez une large gamme de produits agricoles mis en vente par nos producteurs partenaires.
          </p>
          {isProducer && (
            <button
              onClick={() => navigate('/publier-annonce')}
              className="bg-yellow-400 text-green-900 font-semibold px-6 md:px-8 py-3 md:py-4 rounded shadow hover:bg-yellow-500 transition text-sm md:text-base"
            >
              Créer une annonce
            </button>
          )}
        </div>
      </section>

      {/* Filter/Search Bar */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <input
            type="text"
            placeholder="Rechercher un produit"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
          >
            <option>Catégorie</option>
            <option>Fruits</option>
            <option>Légumes</option>
            <option>Grains</option>
            <option>Autres</option>
          </select>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
          >
            <option>Localisation</option>
            <option>Conakry</option>
            <option>Kankan</option>
            <option>Labé</option>
            <option>Nzérékoré</option>
          </select>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setSelectedLocation('');
            }}
            className="bg-yellow-400 text-green-900 font-semibold px-4 md:px-6 py-2 rounded shadow hover:bg-yellow-500 transition text-sm md:text-base"
          >
            Réinitialiser
          </button>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">Chargement des annonces...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 text-lg">{error}</p>
            <p className="text-gray-400 mt-2">Vérifiez que le serveur backend est démarré.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredAnnonces.length > 0 ? (
              filteredAnnonces.map((annonce) => (
                <div key={annonce._id || Math.random()} className="relative rounded-lg overflow-hidden shadow-lg bg-white">
                  <img
                    src={annonce.images && annonce.images.length > 0 ? `http://localhost:3000${annonce.images[0]}` : '/src/assets/default-product.png'}
                    alt={annonce.titre || 'Produit'}
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      e.target.src = '/src/assets/default-product.png';
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-white bg-opacity-75 text-xs font-semibold px-2 py-1 rounded">
                    {annonce.titre || 'Produit'}
                  </div>
                  <div className="absolute top-2 right-2 bg-white bg-opacity-75 text-xs font-semibold px-2 py-1 rounded flex items-center space-x-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21c-4-4-6-7-6-10a6 6 0 1112 0c0 3-2 6-6 10z" />
                    </svg>
                    <span>
                      {typeof annonce.localisation === 'object'
                        ? (annonce.localisation?.region || annonce.localisation?.ville || 'Localisation')
                        : (annonce.localisation || 'Localisation')}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-green-900 text-white text-xs font-semibold px-2 py-1 rounded">
                    {annonce.prix || 'Prix'} GNF / unité
                  </div>
                  <button
                    onClick={() => navigate(`/annonces/${annonce._id}`)}
                    className="absolute bottom-2 right-2 bg-green-700 text-white text-xs font-semibold px-2 py-1 rounded hover:bg-green-600 transition"
                  >
                    voir plus
                  </button>
                  
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500 text-lg">
                  {annonces.length === 0 ? 'Aucune annonce disponible pour le moment.' : 'Aucune annonce ne correspond à vos critères de recherche.'}
                </p>
                <p className="text-gray-400 mt-2">
                  {annonces.length === 0 ? 'Soyez le premier à publier une annonce !' : 'Essayez de modifier vos filtres.'}
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Message Modal */}
      {showMessageModal && selectedAnnonce && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Contacter le vendeur
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Annonce:</strong> {selectedAnnonce.titre}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Prix:</strong> {selectedAnnonce.prix} GNF / unité
              </p>
            </div>
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Écrivez votre message au vendeur..."
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-700 resize-none"
              rows="4"
              disabled={sendingMessage}
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setMessageContent('');
                  setSelectedAnnonce(null);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition"
                disabled={sendingMessage}
              >
                Annuler
              </button>
              <button
                onClick={handleSendMessage}
                disabled={sendingMessage || !messageContent.trim()}
                className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
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

export default Annonces;
