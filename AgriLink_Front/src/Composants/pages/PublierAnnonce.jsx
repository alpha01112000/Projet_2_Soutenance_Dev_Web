import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PublierAnnonce = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier l'authentification et récupérer les données utilisateur
  useEffect(() => {
    const checkAuthAndRole = async () => {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');

      if (!token) {
        alert('Vous devez être connecté pour publier une annonce.');
        navigate('/login');
        return;
      }

      if (userRole !== 'producteur') {
        alert('Seuls les producteurs peuvent publier des annonces.');
        navigate('/annonces');
        return;
      }

      try {
        // Récupérer les données complètes de l'utilisateur
        const res = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data.user);

        // Pré-remplir le formulaire avec les données utilisateur
        setFormData(prev => ({
          ...prev,
          nomContact: `${res.data.user.prenom} ${res.data.user.nom}`,
          emailContact: res.data.user.email
        }));

        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          alert('Session expirée. Veuillez vous reconnecter.');
          navigate('/login');
        } else {
          alert('Erreur lors de la vérification de l\'authentification.');
          navigate('/annonces');
        }
      }
    };

    checkAuthAndRole();
  }, [navigate]);

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
      navigate('/annonces');
    } catch (error) {
      console.error('Erreur lors de la création de l\'annonce:', error);
      if (error.response?.status === 401) {
        alert('Session expirée. Veuillez vous reconnecter.');
        navigate('/login');
      } else if (error.response?.status === 403) {
        alert('Vous n\'avez pas les droits pour publier une annonce.');
        navigate('/annonces');
      } else {
        alert('Erreur lors de la publication de l\'annonce. Veuillez réessayer.');
      }
    }
  };

  const handleCancel = () => {
    navigate('/annonces');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 bg-white shadow-md max-w-7xl mx-auto space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <img src="/src/assets/logo.png" alt="AgriLink Logo" className="h-8 md:h-10 w-8 md:w-10" />
          <span className="font-bold text-lg md:text-xl text-green-900">AgriLink</span>
        </div>
        <nav className="flex flex-wrap justify-center space-x-4 md:space-x-8 text-gray-700 font-semibold text-sm md:text-base">
          <button onClick={() => navigate('/')} className="hover:text-green-700">Accueil</button>
          <button onClick={() => navigate('/annonces')} className="hover:text-green-700">Les annonces</button>
          <button onClick={() => navigate('/faq')} className="hover:text-green-700">FAQ</button>
          <button onClick={() => navigate('/apropos')} className="hover:text-green-700">À propos</button>
          <button onClick={() => navigate('/contact')} className="hover:text-green-700">Contact</button>
        </nav>
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
          <span className="text-gray-700 font-semibold text-sm md:text-base text-center">
            Bonjour {user?.prenom || user?.nom || 'Producteur'}
          </span>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('userRole');
              navigate('/login');
            }}
            className="bg-yellow-400 text-green-900 font-semibold px-3 md:px-4 py-2 rounded shadow hover:bg-yellow-500 transition text-sm md:text-base"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-green-900 text-white h-80 md:h-130 flex items-center justify-center">
        <img
          src="/src/assets/creer une annonce.png"
          alt="Contact background"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="relative bg-opacity-70 rounded-lg p-6 md:p-8 max-w-3xl text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 md:mb-6 drop-shadow-lg">Publiez votre annonce en quelques clics</h1>
          <p className="text-lg md:text-xl mb-6 md:mb-8 drop-shadow-md px-4">
            Mettez en avant vos produits agricoles et trouvez rapidement des acheteurs intéressés.
          </p>
          <button
            onClick={() => navigate('/annonces')}
            className="bg-yellow-400 text-green-900 font-semibold px-6 md:px-8 py-3 md:py-4 rounded shadow hover:bg-yellow-500 transition text-sm md:text-base"
          >
            Explorer les annonces
          </button>
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12 bg-white">
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h2 className="text-lg font-semibold text-green-800 mb-2">Informations de contact</h2>
          <p className="text-green-700 text-sm">
            Les champs nom et email sont automatiquement remplis avec vos informations d'inscription et ne peuvent pas être modifiés.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label htmlFor="titre" className="block text-sm font-medium text-gray-700 mb-1">
              Nom du produit <span className="text-red-500">*</span>
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
              Prix du produit (GNF / kg ou unité) <span className="text-red-500">*</span>
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
              Quantité disponible <span className="text-red-500">*</span>
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
              <span className="text-xs text-gray-500 ml-2">(Auto-rempli)</span>
            </label>
            <input
              type="text"
              id="nomContact"
              name="nomContact"
              value={formData.nomContact}
              disabled
              className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="emailContact" className="block text-sm font-medium text-gray-700 mb-1">
              Email de contact <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-2">(Auto-rempli)</span>
            </label>
            <input
              type="email"
              id="emailContact"
              name="emailContact"
              value={formData.emailContact}
              disabled
              className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
              Région <span className="text-red-500">*</span>
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
              Ville <span className="text-red-500">*</span>
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

          <div className="md:col-span-2 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 text-gray-700 font-semibold px-4 md:px-6 py-3 rounded hover:bg-gray-400 transition text-sm md:text-base"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-yellow-400 text-green-900 font-semibold px-4 md:px-6 py-3 rounded hover:bg-yellow-500 transition text-sm md:text-base"
            >
              Publier l'annonce
            </button>
          </div>
        </form>
      </section>

      {/* Footer */}
      <footer className="bg-[#EBE9E9] border-t border-gray-300 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <img src="/src/assets/logo.png" alt="AgriLink Logo" className="h-10 w-10 mb-2" />
            <p className="text-gray-600 text-sm">
              Reconnecter l'agriculture locale,
              <br />
              Nous travaillons à créer un avenir <br /> dans lequel les agriculteurs cultivent davantage, <br />
              gagnent davantage et où les communautés locales mangent mieux chaque jour.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-8 md:space-x-12">
            <div>
              <h4 className="font-semibold mb-2">Liens utiles</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>
                  <button onClick={() => navigate('/apropos')} className="hover:text-green-700">
                    À propos
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/annonces')} className="hover:text-green-700">
                    Explorer les annonces
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/faq')} className="hover:text-green-700">
                    FAQ
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/contact')} className="hover:text-green-700">
                    Contact
                  </button>
                </li>
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

export default PublierAnnonce;
