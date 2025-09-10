import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Header';

const faqData = {
  producteurs: [
    {
      question: "Comment s'inscrire en tant qu'utilisateur ?",
      answer: "Pour vous inscrire, cliquez sur le bouton 'Se connecter' en haut à droite, puis sélectionnez 'Créer un compte'. Remplissez le formulaire avec vos informations personnelles et validez."
    },
    {
      question: "Quels produits puis-je vendre sur AgriLink",
      answer: "Tous les produits agricoles locaux peuvent être publiés, y compris les fruits, légumes, céréales, et autres produits issus de l'agriculture guinéenne."
    },
    {
      question: "Est-ce que la plateforme prend une commission ?",
      answer: "AgriLink ne prend pas de commission sur les ventes. La plateforme facilite la mise en relation entre producteurs et acheteurs."
    }
  ],
  acheteurs: [
    {
      question: "Comment passer une commande ?",
      answer: "Pour passer une commande, sélectionnez le produit souhaité, ajoutez-le à votre panier, puis suivez le processus de paiement."
    },
    {
      question: "Puis-je négocier les prix ?",
      answer: "Oui, vous pouvez négocier directement avec le vendeur via la messagerie intégrée."
    },
    {
      question: "Comment se passe la livraison ?",
      answer: "La livraison est organisée directement entre l'acheteur et le vendeur selon les modalités convenues."
    }
  ],
  general: [
    {
      question: "Est-ce que l'application fonctionne sans Internet ?",
      answer: "Non, une connexion Internet est nécessaire pour utiliser toutes les fonctionnalités de l'application."
    },
    {
      question: "AgriLink est-il disponible partout en Guinée ?",
      answer: "Oui, AgriLink est accessible partout en Guinée via une connexion Internet."
    }
  ]
};

const FAQ = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState({ producteurs: null, acheteurs: null, general: null });
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return;
      }
      const res = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur', error);
      setUser(null);
    }
  };

  const toggleIndex = (category, index) => {
    setActiveIndex((prev) => ({
      ...prev,
      [category]: prev[category] === index ? null : index
    }));
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="font-sans text-gray-900">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 bg-white shadow-md max-w-7xl mx-auto space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <img src="/src/assets/logo.png" alt="AgriLink Logo" className="h-8 md:h-10 w-8 md:w-10" />
          <span className="font-bold text-lg md:text-xl text-green-900">AgriLink</span>
        </div>
        <nav className="flex flex-wrap justify-center space-x-4 md:space-x-8 text-gray-700 font-semibold text-sm md:text-base">
          <Link to="/" className="hover:text-green-700">Accueil</Link>
          <Link to="/annonces" className="hover:text-green-700">Les annonces</Link>
          <Link to="/faq" className="text-green-700 font-bold">FAQ</Link>
          <Link to="/apropos" className="hover:text-green-700">À propos</Link>
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
          <button onClick={() => navigate('/login')} className="bg-yellow-400 text-black font-semibold px-6 py-2 rounded shadow hover:bg-yellow-500 transition">
            Se connecter
          </button>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white flex items-center justify-center h-80 md:h-96">
        <img
          src="/src/assets/Desktop - 22 (3).png"
          alt="FAQ background"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="relative rounded-lg p-6 md:p-8 max-w-3xl text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">FAQ</h1>
          <p className="text-base md:text-lg px-4">
            Trouvez rapidement des <span className="font-bold">réponses</span> aux questions les plus fréquentes sur <span className="font-bold">AgriLink</span>.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        {/* Pour Les Producteurs */}
        <div>
          <h2 className="text-xl font-semibold mb-6 border-b-2 border-green-700 inline-block pb-1">Pour Les Producteurs :</h2>
          <div className="space-y-4">
            {faqData.producteurs.map((faq, index) => (
              <div key={index} className="bg-green-200 rounded-lg shadow-md">
                <button
                  onClick={() => toggleIndex('producteurs', index)}
                  className="w-full flex justify-between items-center px-6 py-4 text-left text-gray-800 font-semibold focus:outline-none"
                >
                  {faq.question}
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-300 ${activeIndex.producteurs === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeIndex.producteurs === index && (
                  <div className="px-6 pb-4 text-gray-700">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pour Les Acheteurs */}
        <div>
          <h2 className="text-xl font-semibold mb-6 border-b-2 border-yellow-400 inline-block pb-1">Pour Les Acheteurs :</h2>
          <div className="space-y-4">
            {faqData.acheteurs.map((faq, index) => (
              <div key={index} className="bg-yellow-200 rounded-lg shadow-md">
                <button
                  onClick={() => toggleIndex('acheteurs', index)}
                  className="w-full flex justify-between items-center px-6 py-4 text-left text-gray-800 font-semibold focus:outline-none"
                >
                  {faq.question}
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-300 ${activeIndex.acheteurs === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeIndex.acheteurs === index && (
                  <div className="px-6 pb-4 text-gray-700">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Général */}
        <div>
          <h2 className="text-xl font-semibold mb-6 border-b-2 border-gray-400 inline-block pb-1">Général :</h2>
          <div className="space-y-4">
            {faqData.general.map((faq, index) => (
              <div key={index} className="bg-gray-200 rounded-lg shadow-md">
                <button
                  onClick={() => toggleIndex('general', index)}
                  className="w-full flex justify-between items-center px-6 py-4 text-left text-gray-800 font-semibold focus:outline-none"
                >
                  {faq.question}
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-300 ${activeIndex.general === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeIndex.general === index && (
                  <div className="px-6 pb-4 text-gray-700">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center mt-12">
          <p className="text-gray-600 italic mb-4">Vous n'avez pas trouvé la réponse à votre question ?</p>
          <button onClick={() => navigate('/contact')} className="bg-green-700 text-white font-semibold px-8 py-3 rounded shadow hover:bg-green-800 transition">
            Contactez-nous
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-300 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between">
          <div>
            <img src="/src/assets/logo.png" alt="AgriLink Logo" className="h-10 w-10 mb-2" />
            <p className="text-gray-600 text-sm">Reconnecter l’agriculture locale,
              <br />Nous travaillons à créer un avenir <br /> dans lequel les agriculteurs cultivent davantage, <br />
              gagnent davantage et où les communautés locales mangent mieux chaque jour.</p>
          </div>
          <div className="flex space-x-12 mt-6 md:mt-0">
            <div>
              <h4 className="font-semibold mb-2">Liens utiles</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li><Link to="/" className="hover:text-green-700">Accueil</Link></li>
                <li><Link to="/apropos" className="hover:text-green-700">À propos</Link></li>
                <li><Link to="/annonces" className="hover:text-green-700">Explorer les annonces</Link></li>
                <li><Link to="/faq" className="hover:text-green-700">FAQ</Link></li>
                <li><Link to="/contact" className="hover:text-green-700">Contact</Link></li>
              </ul>
            </div>
            <div className="text-gray-600 text-sm">
              <p>AgriLink —
               ,Reconnecter l’agriculture locale,</p>
              <p>©️ 2025 AgriLink. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FAQ;
