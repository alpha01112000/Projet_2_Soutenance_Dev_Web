import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import axios from 'axios';
import Header from '../Header';

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState(null);


  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      const response = await axios.post('/api/contact/form', formData);
      setStatus({ success: true, message: response.data.message });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus({ success: false, message: error.response?.data?.errors?.[0]?.msg || 'Erreur lors de l\'envoi du message' });
    }
  };

  return (
    <div className="font-sans text-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-green-900 text-white h-130 flex items-center justify-center">
        <img
          src="/src/assets/Desktop - 24.png"
          alt="Contact background"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="relative  bg-opacity-70 rounded-lg p-8 max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold mb-4">Contactez-nous</h1>
          <p className="text-lg">
            Une <strong>question</strong>, un <strong>partenariat</strong> ou un <strong>souci</strong> sur la plateforme ? L'équipe <strong>AgriLink</strong> est à votre écoute.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Votre nom complet"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Votre email"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Sujet"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                placeholder="Votre message"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-400 text-black font-semibold py-3 rounded shadow hover:bg-yellow-300 transition"
            >
              Envoyer le message
            </button>
          </form>
          {status && (
            <p className={`mt-4 text-center ${status.success ? 'text-green-600' : 'text-red-600'}`}>
              {status.message}
            </p>
          )}
        </div>

        {/* Contact Info */}
        <div className="flex flex-col justify-center space-y-6 text-gray-900">
          <p><strong>Adresse :</strong> Conakry, Guinée</p>
          <p><strong>Téléphone :</strong> +224 XXX XXX XXX</p>
          <p><strong>Email support :</strong> contact@agrilink.com</p>
          <p><strong>Horaires :</strong> Lun - Ven, 9h → 18h</p>
          <div className="flex space-x-4 text-green-900 text-xl">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-green-700">
              <FaFacebookF />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-green-700">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#EBE9E9] border-t border-gray-300 py-8 mt-16">
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
                <li><Link to="/apropos" className="hover:text-green-700">À propos</Link></li>
                <li><Link to="/annonces" className="hover:text-green-700">Explorer les annonces</Link></li>
                <li><Link to="/faq" className="hover:text-green-700">FAQ</Link></li>
                <li><Link to="/contact" className="hover:text-green-700">Contact</Link></li>
              </ul>
            </div>
            <div className="text-gray-600 text-sm">
              <p>AgriLink — Reconnecter l’agriculture locale.</p>
              <p>©️ 2025 AgriLink. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
