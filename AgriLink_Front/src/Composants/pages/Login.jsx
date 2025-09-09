import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      // Call backend API to login user
      const response = await axios.post('/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      // Store token and user info in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.user.role);

      setStatus({ success: true, message: 'Connexion réussie !' });

      // Redirect based on role
      if (response.data.user.role === 'producteur') {
        navigate('/tableau-de-bord');
      } else {
        navigate('/');
      }
    } catch (error) {
      setStatus({ success: false, message: error.response?.data?.error || 'Erreur lors de la connexion' });
    }
  };

  return (
<div className="min-h-screen flex h-screen overflow-hidden">
      {/* Left image */}
      <div className="w-1/2">
        <img
          src="/src/assets/Longin.png"
          alt="Agriculteur souriant"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right form */}
      <div className="w-1/2 flex flex-col justify-center items-center p-12">
        <img src="/src/assets/logo.png" alt="AgriLink Logo" className="mb-6 w-24" />
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Heureux de vous revoir <span role="img" aria-label="wave">👋</span> !<br />
          Connectez-vous pour accéder à vos annonces et services.
        </h2>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Entrez votre mail"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-1">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Entrez votre mot de passe"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-semibold py-3 rounded shadow hover:bg-yellow-300 transition"
          >
            Se connecter
          </button>

          {status && (
            <p className={`mt-4 text-center ${status.success ? 'text-green-600' : 'text-red-600'}`}>
              {status.message}
            </p>
          )}

          <p className="mt-4 text-center text-sm text-gray-600">
            Pas encore de compte ?&nbsp;
            <Link to="/register" className="font-semibold underline hover:text-green-700">
              Créer un compte
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
