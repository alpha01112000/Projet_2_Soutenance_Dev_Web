 import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = ({ user, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 bg-white shadow-md max-w-7xl mx-auto space-y-4 md:space-y-0">
      <div className="flex items-center space-x-2">
        <img src="/src/assets/logo.png" alt="AgriLink Logo" className="h-8 md:h-10 w-8 md:w-10" />
        <span className="font-bold text-lg md:text-xl text-green-900">AgriLink</span>
      </div>
      <nav className="flex flex-wrap justify-center space-x-4 md:space-x-6 text-gray-700 font-semibold text-sm md:text-base">
        <Link to="/" className="hover:text-green-700">Accueil</Link>
        <Link to="/annonces" className="hover:text-green-700">les annonces</Link>
        <Link to="/faq" className="hover:text-green-700">FAQ</Link>
        <Link to="/apropos" className="hover:text-green-700">A propos</Link>
        <Link to="/contact" className="hover:text-green-700">Contact</Link>
      </nav>
      {user ? (
        <div className="relative flex items-center space-x-2 cursor-pointer" onClick={toggleDropdown}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1118.88 6.196 9 9 0 015.12 17.804z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-gray-700 font-semibold">Bonjour {user.prenom || user.nom || 'Utilisateur'}</span>
          <svg
            className={`h-4 w-4 text-gray-700 transform transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10 p-2">
              <Link
                to="/tableau-de-bord"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                onClick={() => setDropdownOpen(false)}
              >
                Tableau de bord
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 mt-2 bg-green-700 text-white rounded hover:bg-green-800"
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="ml-4 bg-[#FBC02D] text-black font-semibold px-6 py-2 rounded shadow hover:bg-yellow-400 transition"
        >
          Se connecter
        </button>
      )}
    </header>
  );
};

const TableauDeBordWithHeader = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('vueEnsemble');
  const [stats, setStats] = useState({ annoncesCount: 0, contactsCount: 0 });
  const [annonces, setAnnonces] = useState([]);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    prix: '',
    quantite: '',
    categorie: '',
    nomContact: '',
    emailContact: '',
    region: '',
    ville: '',
    images: null,
  });

  const categories = ['Fruits', 'Légumes', 'Grains', 'Autres'];
  const regions = ['Conakry', 'Kankan', 'Labé', 'Nzérékoré'];

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'producteur' && userRole !== 'admin') {
      alert('Accès refusé. Cette page est réservée aux producteurs.');
      navigate('/');
      return;
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (activeSection === 'vueEnsemble') {
      fetchStats();
      fetchDernieresAnnonces();
    } else if (activeSection === 'mesAnnonces') {
      fetchMesAnnonces();
    } else if (activeSection === 'messagesRecus') {
      fetchMessagesRecus();
    }
  }, [activeSection]);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Aucun token trouvé, redirection vers login');
        setLoading(false);
        navigate('/login');
        return;
      }
      const res = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data.user);
      setFormData(prev => ({ ...prev, nomContact: `${res.data.user.prenom} ${res.data.user.nom}`, emailContact: res.data.user.email }));
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur', error);
      // Si token invalide ou expiré, rediriger vers login
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setLoading(false);
        navigate('/login');
      }
      setUser(null);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const annoncesRes = await axios.get('/api/annonces/me/count', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const messagesRes = await axios.get('/api/messages/count', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStats({ annoncesCount: annoncesRes.data.count, contactsCount: messagesRes.data.count });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques', error);
    }
  };

  const fetchDernieresAnnonces = async () => {
    try {
      const res = await axios.get('/api/annonces/me/mine?limit=5&sort=-createdAt', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAnnonces(res.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des dernières annonces', error);
    }
  };

  const fetchMesAnnonces = async () => {
    try {
      const res = await axios.get('/api/annonces/me/mine', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAnnonces(res.data);
    } catch (error) {
      console.error('Erreur lors de la récupération de mes annonces', error);
    }
  };

  const fetchMessagesRecus = async () => {
    try {
      const res = await axios.get('/api/messages/mine', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessages(res.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des messages reçus', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      setFormData({ ...formData, images: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // Mapper les champs aux noms attendus par le backend
      formDataToSend.append('titre', formData.titre);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('prix', formData.prix);
      formDataToSend.append('quantite', formData.quantite);
      formDataToSend.append('categorie', formData.categorie);

      // Structure de localisation attendue par le backend
      formDataToSend.append('localisation[region]', formData.region);
      formDataToSend.append('localisation[ville]', formData.ville);

      // Structure de contact attendue par le backend
      formDataToSend.append('contact[nom]', formData.nomContact);
      formDataToSend.append('contact[email]', formData.emailContact);

      // Images en tableau (pour l'instant une seule image)
      if (formData.images) {
        formDataToSend.append('images', formData.images);
      }

      const token = localStorage.getItem('token');
      const response = await axios.post('/api/annonces', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Annonce créée:', response.data);
      alert('Annonce publiée avec succès !');
      setActiveSection('mesAnnonces');
    } catch (error) {
      console.error('Erreur lors de la création de l\'annonce:', error);
      alert('Erreur lors de la publication de l\'annonce. Veuillez réessayer.');
    }
  };

  const handleCancel = () => {
    setActiveSection('mesAnnonces');
  };

  const handleDelete = async (annonceId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`/api/annonces/${annonceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAnnonces(annonces.filter(annonce => annonce._id !== annonceId));
      alert('Annonce supprimée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      if (error.response?.status === 401) {
        alert('Session expirée. Veuillez vous reconnecter.');
      } else if (error.response?.status === 403) {
        alert('Vous n\'avez pas les droits pour supprimer cette annonce.');
      } else if (error.response?.status === 404) {
        alert('Annonce introuvable.');
      } else {
        alert(`Erreur lors de la suppression: ${error.response?.data?.error || error.message}`);
      }
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'vueEnsemble':
        return (
          <>
            <h1 className="text-xl md:text-2xl font-semibold mb-4">Vue d'ensemble</h1>
            <h2 className="text-green-700 mb-2 text-lg md:text-xl">Informations principales</h2>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
              <div className="bg-gray-200 p-4 md:p-6 rounded w-full sm:w-40 text-center">
                <div className="text-3xl md:text-4xl font-bold">{stats.annoncesCount}</div>
                <div className="text-sm md:text-base">annonces publiées</div>
              </div>
              <div className="bg-gray-200 p-4 md:p-6 rounded w-full sm:w-40 text-center">
                <div className="text-3xl md:text-4xl font-bold">{stats.contactsCount}</div>
                <div className="text-sm md:text-base">contacts reçus</div>
              </div>
            </div>
            <h2 className="text-green-700 mb-2 text-lg md:text-xl">Dernières annonces</h2>
            <div className="bg-gray-200 rounded p-4 md:p-6">
              {annonces.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Aucune annonce récente.</p>
              ) : (
                <ul className="space-y-2">
                  {annonces.map((annonce) => (
                    <li key={annonce._id} className="border-b border-gray-300 py-3 last:border-b-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                          <strong className="text-gray-800 text-sm md:text-base">{annonce.titre}</strong>
                          <span className="text-gray-600 text-sm ml-2">- {annonce.categorie || 'Catégorie non spécifiée'}</span>
                        </div>
                        <div className="text-gray-600 text-sm mt-1 sm:mt-0">
                          {annonce.prix} GNF
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        );
      case 'mesAnnonces':
        return (
          <>
            <h1 className="text-xl md:text-2xl font-semibold mb-4">Mes annonces</h1>
            {annonces.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Aucune annonce publiée.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 md:p-3 text-left text-sm md:text-base">Image</th>
                      <th className="border border-gray-300 p-2 md:p-3 text-left text-sm md:text-base">Titre</th>
                      <th className="border border-gray-300 p-2 md:p-3 text-left text-sm md:text-base">Catégorie</th>
                      <th className="border border-gray-300 p-2 md:p-3 text-left text-sm md:text-base">Prix</th>
                      <th className="border border-gray-300 p-2 md:p-3 text-left text-sm md:text-base">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {annonces.map((annonce) => (
                      <tr key={annonce._id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 p-2 md:p-3">
                          {annonce.images && annonce.images.length > 0 ? (
                            <img src={annonce.images[0]} alt={annonce.titre} className="w-12 h-12 md:w-16 md:h-16 object-cover rounded" />
                          ) : (
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">N/A</div>
                          )}
                        </td>
                        <td className="border border-gray-300 p-2 md:p-3 text-sm md:text-base font-medium">{annonce.titre}</td>
                        <td className="border border-gray-300 p-2 md:p-3 text-sm md:text-base">{annonce.categorie || 'N/A'}</td>
                        <td className="border border-gray-300 p-2 md:p-3 text-sm md:text-base">{annonce.prix} GNF</td>
                        <td className="border border-gray-300 p-2 md:p-3">
                          <button
                            className="text-red-600 hover:underline text-sm md:text-base px-2 py-1 rounded hover:bg-red-50 transition-colors"
                            onClick={() => handleDelete(annonce._id)}
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        );
      case 'creerAnnonce':
        if (localStorage.getItem('userRole') !== 'producteur') {
          return (
            <div className="p-4 md:p-6">
              <h2 className="text-red-600 font-semibold text-lg md:text-xl">Vous devez être connecté en tant que producteur pour créer une annonce.</h2>
            </div>
          );
        }
        return (
          <>
            <h1 className="text-xl md:text-2xl font-semibold mb-4">Créer une annonce</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label htmlFor="titre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du produit
                </label>
                <input
                  type="text"
                  id="titre"
                  name="titre"
                  placeholder="Ex : Pommes de terre fraîches"
                  value={formData.titre}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description du produit <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Ajoutez des détails : variété, qualité, méthode de culture, etc."
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  required
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>

              <div>
                <label htmlFor="prix" className="block text-sm font-medium text-gray-700 mb-1">
                  Prix du produit (GNF / kg ou unité)
                </label>
                <input
                  type="number"
                  id="prix"
                  name="prix"
                  placeholder="Ex : 12 000"
                  value={formData.prix}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>

              <div>
                <label htmlFor="quantite" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantité disponible
                </label>
                <input
                  type="number"
                  id="quantite"
                  name="quantite"
                  placeholder="Ex : 200"
                  value={formData.quantite}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>

              <div>
                <label htmlFor="categorie" className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <select
                  id="categorie"
                  name="categorie"
                  value={formData.categorie}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((categorie) => (
                    <option key={categorie} value={categorie}>
                      {categorie}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="nomContact" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de contact <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nomContact"
                  name="nomContact"
                  placeholder="Votre nom complet"
                  value={formData.nomContact}
                  onChange={handleChange}
                  required
                  disabled
                  className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-100 text-gray-700"
                />
              </div>

              <div>
                <label htmlFor="emailContact" className="block text-sm font-medium text-gray-700 mb-1">
                  Email de contact
                </label>
                <input
                  type="email"
                  id="emailContact"
                  name="emailContact"
                  placeholder="votre.email@example.com"
                  value={formData.emailContact}
                  onChange={handleChange}
                  required
                  disabled
                  className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-100 text-gray-700"
                />
              </div>

              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                  Région
                </label>
                <select
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
                >
                  <option value="">Sélectionner une région</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="ville" className="block text-sm font-medium text-gray-700 mb-1">
                  Ville
                </label>
                <input
                  type="text"
                  id="ville"
                  name="ville"
                  placeholder="Nom de la ville"
                  value={formData.ville}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>

              <div>
                <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
                  Photos du produit
                </label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>

              <div className="md:col-span-2 flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded hover:bg-gray-400 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-yellow-400 text-green-900 font-semibold px-6 py-3 rounded hover:bg-yellow-500 transition"
                >
                  Publier l'annonce
                </button>
              </div>
            </form>
          </>
        );
      case 'messagesRecus':
        return (
          <>
            <h1 className="text-xl md:text-2xl font-semibold mb-4">Messages reçus</h1>
            {messages.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Aucun message reçu.</p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg._id} className="bg-gray-50 p-4 md:p-6 rounded-lg shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center mb-2">
                          <strong className="text-gray-800 text-sm md:text-base font-medium">
                            {msg.sender ? `${msg.sender.prenom || ''} ${msg.sender.nom || ''}`.trim() : 'Utilisateur inconnu'}
                          </strong>
                          <span className="text-gray-500 text-xs sm:ml-2 mt-1 sm:mt-0">
                            {msg.sender?.email || 'Email non fourni'}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm md:text-base leading-relaxed">{msg.content}</p>
                      </div>
                      <div className="text-gray-400 text-xs mt-2 sm:mt-0 sm:ml-4">
                        {new Date(msg.createdAt || Date.now()).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }} />
      <div className="flex flex-col md:flex-row md:h-screen overflow-hidden">
        <aside className="bg-green-700 text-white w-full md:w-48 flex flex-col p-4 space-y-4 md:h-full">
          <div
            className={`p-2 rounded cursor-pointer ${activeSection === 'vueEnsemble' ? 'bg-white text-green-700' : ''}`}
            onClick={() => setActiveSection('vueEnsemble')}
          >
            Vue d'ensemble
          </div>
          <div
            className={`p-2 rounded cursor-pointer ${activeSection === 'mesAnnonces' ? 'bg-white text-green-700' : ''}`}
            onClick={() => setActiveSection('mesAnnonces')}
          >
            Mes annonces
          </div>
          <div
            className={`p-2 rounded cursor-pointer ${activeSection === 'creerAnnonce' ? 'bg-white text-green-700' : ''}`}
            onClick={() => setActiveSection('creerAnnonce')}
          >
            Créer une annonce
          </div>
          <div
            className={`p-2 rounded cursor-pointer ${activeSection === 'messagesRecus' ? 'bg-white text-green-700' : ''}`}
            onClick={() => setActiveSection('messagesRecus')}
          >
            Messages reçus
          </div>
          <div className="mt-auto p-2 cursor-pointer flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Paramètre</span>
          </div>
        </aside>
        <main className="flex-1 p-4 md:p-8 overflow-auto bg-white">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default TableauDeBordWithHeader;
