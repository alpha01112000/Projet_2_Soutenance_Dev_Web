import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Header';

const APropos = () => {
  const navigate = useNavigate();
  return (
    <div className="font-sans text-gray-900 relative">
      <Header />

      {/* Hero Section */}
      <section className="relative text-white h-80 md:h-120 flex items-center justify-center">
        <img
          src="/src/assets/Desktop - 17.png"
          alt="À propos background"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="relative rounded-full w-64 md:w-72 h-64 md:h-72 flex flex-col items-center justify-center text-center px-4 md:px-6">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">À propos d'AgriLink</h1>
            <p className="max-w-2xl text-base md:text-lg px-4">
              Découvrez qui nous sommes, notre vision et nos valeurs pour transformer le marché agricole guinéen.
            </p>
          </div>
      </section>

      {/* Qui Sommes-Nous */}
      <section className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center md:space-x-12">
        <div className="md:w-1/2 pr-6">
          <h2 className="text-2xl font-semibold mb-4 border-l-4 border-green-900 pl-4">Qui Sommes-Nous ?</h2>
          <p className="text-gray-700">
            AgriLink est une plateforme numérique conçue pour moderniser le marché agricole guinéen. Elle connecte les producteurs locaux aux acheteurs, facilitant les échanges, réduisant les intermédiaires, et valorisant la production nationale.
          </p>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0">
          <img src="/src/assets/smart-agriculture-iot-with-hand-planting-tree-background 2.png" alt="Qui Sommes-Nous" className="rounded-lg shadow-lg object-top w-200 h-130" />
        </div>
      </section>

      {/* Notre Vision */}
      <section className="max-w-7xl mx-auto px-6 py-16 bg-[#EBE9E9] flex flex-col md:flex-row items-center md:space-x-12">
        <div className="md:w-1/2 order-2 md:order-1 mt-8 md:mt-0">
          <img src="/src/assets/HELLO-FUTURE.jpg" alt="Notre Vision" className="rounded-lg shadow-lg w-full" />
        </div>
        <div className="md:w-1/2 order-1 md:order-2">
          <h2 className="text-2xl font-semibold mb-4 border-l-4 border-green-900 pl-4">Notre Vision</h2>
          <p className="text-gray-700">
            Devenir la passerelle principale entre les producteurs guinéens et le marché local à travers une solution technologique simple, accessible et fiable.
          </p>
        </div>
      </section>

      {/* Notre Mission */}
      <section className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center md:space-x-12">
        <div className="md:w-1/2">
          <h2 className="text-2xl font-semibold mb-4 border-l-4 border-green-900 pl-4">Notre Mission</h2>
          <p className="text-gray-700">
            Créer un environnement équitable et fluide pour la vente et l'achat de produits agricoles. Nous croyons en une agriculture plus rentable, mieux organisée et digitalisée.
          </p>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0">
          <img src="/src/assets/african-man-harvesting-vegetables 1.png" alt="Notre Mission" className="rounded-lg shadow-lg w-full" />
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 bg-[#EBE9E9] text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12">Nos Valeurs</h2>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-32 md:w-40 flex flex-col items-center">
            <img src="/src/assets/Group 29.png" alt="Intégrité" className="h-10 md:h-12 mb-3 md:mb-4" />
            <p className="font-semibold text-sm md:text-base">Intégrité</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-32 md:w-40 flex flex-col items-center">
            <img src="/src/assets/Group 30.png" alt="Innovation" className="h-10 md:h-12 mb-3 md:mb-4" />
            <p className="font-semibold text-sm md:text-base">Innovation</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-32 md:w-40 flex flex-col items-center">
            <img src="/src/assets/Group 31.png" alt="Transparence" className="h-10 md:h-12 mb-3 md:mb-4" />
            <p className="font-semibold text-sm md:text-base">Transparence</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-32 md:w-40 flex flex-col items-center">
            <img src="/src/assets/Group 33.png" alt="Collaboration" className="h-10 md:h-12 mb-3 md:mb-4" />
            <p className="font-semibold text-sm md:text-base">Collaboration</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-32 md:w-40 flex flex-col items-center">
            <img src="/src/assets/Group 32.png" alt="Inclusion" className="h-10 md:h-12 mb-3 md:mb-4" />
            <p className="font-semibold text-sm md:text-base">Inclusion</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[#FFFFFF] py-12 text-center">
        <p className="text-lg font-semibold mb-4">Rejoignez-nous et participez à la digitalisation du marché agricole guinéen.</p>
        <button onClick={() => navigate('/register')} className="bg-[#35904F] text-white font-semibold px-8 py-3 rounded shadow hover:bg-yellow-400 transition">
          Créer un compte gratuitement
        </button>
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

export default APropos;
