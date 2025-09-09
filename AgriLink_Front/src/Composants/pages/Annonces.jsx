import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Header';

const Annonces = () => {
  const navigate = useNavigate();
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user role from localStorage
  const userRole = localStorage.getItem('userRole');
  const isProducer = userRole === 'producteur';

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
      <section className="relative bg-green-900 text-white h-130 flex items-center justify-center">
        <img
          src="/src/assets/creer une annonce.png"
          alt="Contact background"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="relative bg-opacity-70 rounded-lg p-8 max-w-3xl text-center">
          <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">Explorer les annonces</h1>
          <p className="text-xl mb-8 drop-shadow-md">
            Parcourez une large gamme de produits agricoles mis en vente par nos producteurs partenaires.
          </p>
          {isProducer && (
            <button
              onClick={() => navigate('/publier-annonce')}
              className="bg-yellow-400 text-green-900 font-semibold px-8 py-4 rounded shadow hover:bg-yellow-500 transition"
            >
              Créer une annonce
            </button>
          )}
        </div>
      </section>

      {/* Filter/Search Bar */}
      <section className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
        <input
          type="text"
          placeholder="Rechercher un produit"
          className="flex-grow border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
        />
        <select className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-700">
          <option>Catégorie</option>
          <option>Fruits</option>
          <option>Légumes</option>
          <option>Grains</option>
          <option>Autres</option>
        </select>
        <select className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-700">
          <option>Localisation</option>
          <option>Conakry</option>
          <option>Kankan</option>
          <option>Labé</option>
          <option>Nzérékoré</option>
        </select>
        <button className="bg-yellow-400 text-green-900 font-semibold px-6 py-2 rounded shadow hover:bg-yellow-500 transition">
          Filtrer
        </button>
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
            {annonces.length > 0 ? (
              annonces.map((annonce) => (
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
                <p className="text-gray-500 text-lg">Aucune annonce disponible pour le moment.</p>
                <p className="text-gray-400 mt-2">Soyez le premier à publier une annonce !</p>
              </div>
            )}
          </div>
        )}
      </section>

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
