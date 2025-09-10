import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    role: 'acheteur', // default role
    telephone: '',
    password: '',
    confirmPassword: '',
    // Acheteur fields
    adresse: '',
    ville: '',
    etat: '',
    // Producteur fields
    typeCulture: '',
    superficie: '',
    experience: '',
    acceptTerms: false,
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.acceptTerms) {
      setStatus({ success: false, message: 'Vous devez accepter les conditions d\'utilisation.' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setStatus({ success: false, message: 'Les mots de passe ne correspondent pas.' });
      return;
    }

    try {
      const userData = {
        prenom: formData.prenom,
        nom: formData.nom,
        email: formData.email,
        role: formData.role,
        telephone: formData.telephone,
        password: formData.password,
      };

      // Add conditional fields based on role
      if (formData.role === 'acheteur') {
        userData.adresse = formData.adresse;
        userData.ville = formData.ville;
      } else if (formData.role === 'producteur') {
        userData.typeCulture = formData.typeCulture;
        userData.superficie = formData.superficie ? parseFloat(formData.superficie) : undefined;
        userData.experience = formData.experience ? parseInt(formData.experience) : undefined;
      }

      const response = await axios.post('/api/auth/register', userData);
      setStatus({ success: true, message: 'Compte créé avec succès !' });
      // Save token and role in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', formData.role);
      // Redirect to login page for all users
      navigate('/login');
    } catch (error) {
      setStatus({ success: false, message: error.response?.data?.message || 'Erreur lors de la création du compte.' });
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row">
      {/* Left image */}
      <div className="w-full md:w-1/2 h-full order-2 md:order-1">
        <img
          src="/src/assets/inscription.png"
          alt="Agriculteur souriant"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right form */}
      <div className="w-full md:w-1/2 flex flex-col items-center p-6 md:p-12 overflow-y-auto order-1 md:order-2">
        <img src="/src/assets/logo.png" alt="AgriLink Logo" className="mb-4 md:mb-6 w-20 md:w-24" />
        <h2 className="text-center mb-4 md:mb-6 text-base md:text-lg font-normal px-4">
          Rejoignez la communauté AgriLink 🌱 et vendez ou trouvez des produits agricoles facilement.
        </h2>

        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-md space-y-3 md:space-y-4 overflow-visible">
          <div>
            <label htmlFor="prenom" className="block mb-1 text-sm font-medium">Prénom</label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              placeholder="Entrez votre prénom"
              value={formData.prenom}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          <div>
            <label htmlFor="nom" className="block mb-1 text-sm font-medium">Nom</label>
            <input
              type="text"
              id="nom"
              name="nom"
              placeholder="Entrez votre nom"
              value={formData.nom}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Entrez votre email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block mb-1 text-sm font-medium">Type de compte que vous voulez créer</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            >
              <option value="acheteur">Acheteur</option>
              <option value="producteur">Producteur</option>
            </select>
          </div>

          {/* Champs spécifiques aux acheteurs */}
          {formData.role === 'acheteur' && (
            <>
              <div>
                <label htmlFor="adresse" className="block mb-1 text-sm font-medium">Adresse</label>
                <input
                  type="text"
                  id="adresse"
                  name="adresse"
                  placeholder="Entrez votre adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>

              <div>
                <label htmlFor="ville" className="block mb-1 text-sm font-medium">Ville</label>
                <input
                  type="text"
                  id="ville"
                  name="ville"
                  placeholder="Entrez votre ville"
                  value={formData.ville}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>
            </>
          )}

          {/* Champs spécifiques aux producteurs */}
          {formData.role === 'producteur' && (
            <>
              <div>
                <label htmlFor="typeCulture" className="block mb-1 text-sm font-medium">Type de culture</label>
                <select
                  id="typeCulture"
                  name="typeCulture"
                  value={formData.typeCulture}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  required
                >
                  <option value="">Sélectionnez un type</option>
                  <option value="fruits">Fruits</option>
                  <option value="legumes">Légumes</option>
                  <option value="grains">Grains</option>
                  <option value="autres">Autres</option>
                </select>
              </div>

              <div>
                <label htmlFor="superficie" className="block mb-1 text-sm font-medium">Superficie (hectares)</label>
                <input
                  type="number"
                  id="superficie"
                  name="superficie"
                  placeholder="Entrez la superficie"
                  value={formData.superficie}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  min="0"
                  required
                />
              </div>

              <div>
                <label htmlFor="experience" className="block mb-1 text-sm font-medium">Expérience (années)</label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  placeholder="Entrez vos années d'expérience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  min="0"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="telephone" className="block mb-1 text-sm font-medium">Téléphone (optionnel)</label>
            <input
              type="tel"
              id="telephone"
              name="telephone"
              placeholder="Entrez votre numéro de téléphone"
              value={formData.telephone}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Entrez votre mot de passe"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              minLength="8"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirmez votre mot de passe"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="acceptTerms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              required
            />
            <label htmlFor="acceptTerms" className="text-sm">J'accepte les conditions d'utilisation</label>
          </div>

          <button
            type="submit"
            className="w-full rounded bg-yellow-400 py-3 font-semibold text-black hover:bg-yellow-300"
          >
            Créer mon compte
          </button>

          {status && (
            <p className={`mt-4 text-center ${status.success ? 'text-green-600' : 'text-red-600'}`}>
              {status.message}
            </p>
          )}

          <p className="mt-4 text-center text-sm text-gray-600">
            Déjà inscrit ?&nbsp;
            <Link to="/login" className="font-semibold underline hover:text-green-700">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
