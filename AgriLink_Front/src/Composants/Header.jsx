import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const navigate = useNavigate();
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
      setUser(res.data.user);
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur', error);
      setUser(null);
    }
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
<header className="flex items-center justify-between p-4 bg-white shadow-md max-w-7xl mx-auto">
      <div className="flex items-center space-x-2">
        <img src="/src/assets/logo.png" alt="AgriLink Logo" className="h-10 w-10" />
        <span className="font-bold text-xl text-green-900">AgriLink</span>
      </div>
      <nav className="hidden md:flex space-x-8 text-gray-700 font-semibold">
        <Link to="/" className="hover:text-green-700">Accueil</Link>
        <Link to="/annonces" className="hover:text-green-700">Les annonces</Link>
        <Link to="/faq" className="hover:text-green-700">FAQ</Link>
        <Link to="/apropos" className="hover:text-green-700">À propos</Link>
        <Link to="/contact" className="hover:text-green-700">Contact</Link>
      </nav>
      <div className="md:hidden">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          aria-label="Toggle menu"
          className="text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {dropdownOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      {dropdownOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10 p-2 md:hidden">
          <Link
            to="/"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            onClick={() => setDropdownOpen(false)}
          >
            Accueil
          </Link>
          <Link
            to="/annonces"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            onClick={() => setDropdownOpen(false)}
          >
            Les annonces
          </Link>
          <Link
            to="/faq"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            onClick={() => setDropdownOpen(false)}
          >
            FAQ
          </Link>
          <Link
            to="/apropos"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            onClick={() => setDropdownOpen(false)}
          >
            À propos
          </Link>
          <Link
            to="/contact"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            onClick={() => setDropdownOpen(false)}
          >
            Contact
          </Link>
        </div>
      )}
      {user ? (
        <div className="relative flex items-center space-x-2 cursor-pointer" onClick={toggleDropdown}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1118.88 6.196 9 9 0 015.12 17.804z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-gray-700 font-semibold">
            Bonjour {user.prenom || user.nom || user.email || 'Utilisateur'}
          </span>
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
              {(user.role === 'producteur' || user.role === 'admin') && (
                <Link
                  to="/tableau-de-bord"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => setDropdownOpen(false)}
                >
                  Tableau de bord
                </Link>
              )}
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
        <button onClick={() => navigate('/login')} className="ml-4 bg-[#FBC02D] text-black font-semibold px-6 py-2 rounded shadow hover:bg-yellow-400 transition">
          Se connecter
        </button>
      )}
    </header>
  );
};

export default Header;
