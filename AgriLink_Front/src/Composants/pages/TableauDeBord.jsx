import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  return (
    <header className="flex items-center justify-between p-6 bg-white shadow-md max-w-7xl mx-auto">
      <div className="flex items-center space-x-2">
        <img src="/src/assets/logo.png" alt="AgriLink Logo" className="h-10 w-10" />
        <span className="font-bold text-xl text-green-900">AgriLink</span>
      </div>
      <nav className="space-x-8 text-gray-700 font-semibold">
        <Link to="/" className="hover:text-green-700">Accueil</Link>
        <Link to="/annonces" className="hover:text-green-700">Les annonces</Link>
        <Link to="/faq" className="hover:text-green-700">FAQ</Link>
        <Link to="/apropos" className="hover:text-green-700">À propos</Link>
        <Link to="/contact" className="hover:text-green-700">Contact</Link>
      </nav>
      <button onClick={() => window.location.href = '/login'} className="ml-4 bg-[#FBC02D] text-black font-semibold px-6 py-2 rounded shadow hover:bg-yellow-400 transition">
        Se connecter
      </button>
    </header>
  );
};

const TableauDeBord = () => {
  const [activeSection, setActiveSection] = useState('vueEnsemble');
  const [stats, setStats] = useState({ annoncesCount: 0, contactsCount: 0 });
  const [annonces, setAnnonces] = useState([]);
  const [messages, setMessages] = useState([]);

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

  const [user, setUser] = useState({});

  const categories = ['Fruits', 'Légumes', 'Grains', 'Autres'];
  const regions = ['Conakry', 'Kankan', 'Labé', 'Nzérékoré'];

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

  const fetchStats = async () => {
    try {
      const annoncesRes = await axios.get('/api/annonces/count');
      const contactsRes = await axios.get('/api/contact/count');
      setStats({ annoncesCount: annoncesRes.data.count, contactsCount: contactsRes.data.count });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques', error);
    }
  };

  const fetchDernieresAnnonces = async () => {
    try {
      const res = await axios.get('/api/annonces?limit=5&sort=-createdAt');
      setAnnonces(res.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des dernières annonces', error);
    }
  };

  const fetchMesAnnonces = async () => {
    try {
      const res = await axios.get('/api/annonces/me/mine');
      console.log('Annonces récupérées:', res.data);
      console.log('Nombre d\'annonces:', res.data.length);
      if (res.data.length > 0) {
        console.log('Première annonce - ID vendeur:', res.data[0].vendeur);
        console.log('Utilisateur connecté - ID:', user._id || 'Non défini');
      }
      setAnnonces(res.data);
    } catch (error) {
      console.error('Erreur lors de la récupération de mes annonces', error);
    }
  };

  const fetchMessagesRecus = async () => {
    try {
      const res = await axios.get('/api/contact/mine');
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
      console.log('Tentative de suppression de l\'annonce:', annonceId);
      console.log('Token présent:', !!token);

      const response = await axios.delete(`/api/annonces/${annonceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Réponse de suppression:', response);

      // Mettre à jour l'état local en supprimant l'annonce de la liste
      setAnnonces(annonces.filter(annonce => annonce._id !== annonceId));
      alert('Annonce supprimée avec succès !');
    } catch (error) {
      console.error('Erreur détaillée lors de la suppression:', error);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.error('Message:', error.message);

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

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setFormData(prev => ({ ...prev, nomContact: `${res.data.prenom} ${res.data.nom}`, emailContact: res.data.email }));
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur', error);
    }
  };

  useEffect(() => {
    if (activeSection === 'creerAnnonce') {
      fetchUser();
    }
  }, [activeSection]);

  const renderContent = () => {
    switch (activeSection) {
      case 'vueEnsemble':
        return (
          <>
            <h1 className="text-2xl font-semibold mb-4">Vue d’ensemble</h1>
            <h2 className="text-green-700 mb-2">Informations principales</h2>
            <div className="flex space-x-4 mb-6">
              <div className="bg-gray-200 p-6 rounded w-40 text-center">
                <div className="text-4xl font-bold">{stats.annoncesCount}</div>
                <div>annonces publiées</div>
              </div>
              <div className="bg-gray-200 p-6 rounded w-40 text-center">
                <div className="text-4xl font-bold">{stats.contactsCount}</div>
                <div>contacts reçus</div>
              </div>
            </div>
            <h2 className="text-green-700 mb-2">Dernières annonces</h2>
            <div className="bg-gray-200 rounded p-4">
              {annonces.length === 0 ? (
                <p>Aucune annonce récente.</p>
              ) : (
                <ul>
                  {annonces.map((annonce) => (
                    <li key={annonce._id} className="border-b py-2">
                      <strong>{annonce.titre}</strong> - {annonce.categorie || 'Catégorie non spécifiée'}
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
            <h1 className="text-2xl font-semibold mb-4">Mes annonces</h1>
            {annonces.length === 0 ? (
              <p>Aucune annonce publiée.</p>
            ) : (
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2">Image</th>
                    <th className="border border-gray-300 p-2">Titre</th>
                    <th className="border border-gray-300 p-2">Catégorie</th>
                    <th className="border border-gray-300 p-2">Prix / (kg ou unité)</th>
                    <th className="border border-gray-300 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {annonces.map((annonce) => (
                    <tr key={annonce._id}>
                      <td className="border border-gray-300 p-2">
                        {annonce.images && annonce.images.length > 0 ? (
                          <img src={annonce.images[0]} alt={annonce.titre} className="w-16 h-16 object-cover" />
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="border border-gray-300 p-2">{annonce.titre}</td>
                      <td className="border border-gray-300 p-2">{annonce.categorie || 'N/A'}</td>
                      <td className="border border-gray-300 p-2">{annonce.prix}</td>
                      <td className="border border-gray-300 p-2">
                        {/* Actions like edit/delete can be added here */}
                        <button className="text-red-600 hover:underline" onClick={() => handleDelete(annonce._id)}>Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        );
      case 'creerAnnonce':
        if (localStorage.getItem('userRole') !== 'producteur') {
          return (
            <div>
              <h2 className="text-red-600 font-semibold">Vous devez être connecté en tant que producteur pour créer une annonce.</h2>
            </div>
          );
        }
        return (
          <>
            <h1 className="text-2xl font-semibold mb-4">Créer une annonce</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <h1 className="text-2xl font-semibold mb-4">Messages reçus</h1>
            {messages.length === 0 ? (
              <p>Aucun message reçu.</p>
            ) : (
              <ul>
                {messages.map((msg) => (
                  <li key={msg._id} className="border-b py-2">
                    <strong>{msg.nom}</strong> : {msg.message}
                  </li>
                ))}
              </ul>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="bg-green-700 text-white w-48 flex flex-col p-4 space-y-4">
        <div
          className={`p-2 rounded cursor-pointer ${activeSection === 'vueEnsemble' ? 'bg-white text-green-700' : ''}`}
          onClick={() => setActiveSection('vueEnsemble')}
        >
          Vue d’ensemble
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
      <main className="flex-1 p-8 overflow-auto bg-white">
        {renderContent()}
      </main>
    </div>
  );
};

export default TableauDeBord;
