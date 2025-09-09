import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Header';

const Accueil = () => {
  const navigate = useNavigate();

  return (
    <div className="font-sans text-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-green-900 text-white">
        <img
          src="/src/assets/accueil.jpg"
          alt="Agriculture background"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="relative max-w-7xl mx-auto px-6 py-32 flex flex-col md:flex-row items-center md:items-start md:space-x-12">
          <div className="md:w-1/2">
            <h1 className="text-5xl font-extrabold mb-6 leading-tight">
              Reliez producteurs et acheteurs pour dynamiser l'agriculture locale en Guinée
            </h1>
            <div className="space-x-4 mt-8">
            <button
              onClick={() => navigate('/annonces')}
              className="bg-yellow-400 text-green-900 font-semibold px-8 py-3 rounded shadow hover:bg-yellow-500 transition"
            >
              Explorer une annonce
            </button>
            <button
              onClick={() => navigate('/publier-annonce')}
              className="bg-[#35904F] text-white font-semibold px-8 py-3 rounded shadow hover:bg-[#4a7c5f] transition"
            >
              Publier une annonce
            </button>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0">
            <img
              src="/src/assets/medium.png"
              alt="People in agriculture"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="max-w-7xl mx-auto px-6 py-20 bg-[#EBE9E9]">
        <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center space-y-4 bg-white p-6 rounded shadow-md relative">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">1</div>
            <div className="mb-4">
              <img src="/src/assets/formulaire-dinscription 1.png" alt="Inscription rapide" className="w-10 h-10 mx-auto" />
            </div>
            <h3 className="font-semibold text-lg">Inscription rapide</h3>
            <p>Créer un compte en quelques clics.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4 bg-white p-6 rounded shadow-md relative">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">2</div>
            <div className="mb-4">
              <img src="/src/assets/pubiliez.png" alt="Publiez ou explorez" className="w-10 h-10 mx-auto" />
            </div>
            <h3 className="font-semibold text-lg">Publiez ou explorez</h3>
            <p>Producteurs publient leurs annonces. Acheteurs consultent et contactent.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4 bg-white p-6 rounded shadow-md relative">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">3</div>
            <div className="mb-4">
              <img src="/src/assets/contact-us 1.png" alt="Contact direct" className="w-10 h-10 mx-auto" />
            </div>
            <h3 className="font-semibold text-lg">Contact direct</h3>
            <p>Échangez en toute transparence entre acheteurs et vendeurs.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4 bg-white p-6 rounded shadow-md relative">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">4</div>
            <div className="mb-4">
              <img src="/src/assets/transation.png" alt="Transaction sécurisée" className="w-10 h-10 mx-auto" />
            </div>
            <h3 className="font-semibold text-lg">Transaction sécurisée</h3>
            <p>Discutez, négociez, puis concluez vos achats simplement.</p>
          </div>
        </div>
      </section>

      {/* Produits agricoles locaux */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">Découvrez les produits agricoles locaux</h2>
          <p className="text-center text-gray-600 mb-12">
            Parcourez une large gamme de produits agricoles mis en vente par nos producteurs partenaires.
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <img src="/src/assets/fraise.jpg" alt="Fraise" className="w-full h-40 object-cover" />
              <div className="absolute bottom-0 left-0 bg-[#FBC02D] text-black px-3 py-1 text-sm font-semibold">Fraise</div>
              <div className="absolute top-2 right-2 bg-green-900 text-white px-2 py-1 text-xs rounded">5 000 GNF / tas</div>
              <button className="absolute bottom-2 right-2 bg-green-900 text-white text-xs px-2 py-1 rounded hover:bg-green-800 transition">
                Voir plus
              </button>
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <img src="/src/assets/Grain.jpg" alt="Grains" className="w-full h-40 object-cover" />
              <div className="absolute bottom-0 left-0 bg-[#FBC02D] text-black px-3 py-1 text-sm font-semibold">Grains</div>
              <div className="absolute top-2 right-2 bg-green-900 text-white px-2 py-1 text-xs rounded">350 000 GNF / sac</div>
              <button className="absolute bottom-2 right-2 bg-green-900 text-white text-xs px-2 py-1 rounded hover:bg-green-800 transition">
                Voir plus
              </button>
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <img src="/src/assets/pommes de terre.png" alt="Pommes de terre" className="w-full h-40 object-cover" />
              <div className="absolute bottom-0 left-0 bg-[#FBC02D] text-black px-3 py-1 text-sm font-semibold">Pommes de terre</div>
              <div className="absolute top-2 right-2 bg-green-900 text-white px-2 py-1 text-xs rounded">12 000 GNF / kg</div>
              <button className="absolute bottom-2 right-2 bg-green-900 text-white text-xs px-2 py-1 rounded hover:bg-green-800 transition">
                Voir plus
              </button>
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <img src="/src/assets/huile de palme.png" alt="Huile de palme" className="w-full h-40 object-cover" />
              <div className="absolute bottom-0 left-0 bg-[#FBC02D] text-black px-3 py-1 text-sm font-semibold">Huile de palme</div>
              <div className="absolute top-2 right-2 bg-green-900 text-white px-2 py-1 text-xs rounded">10 000 GNF / litre</div>
              <button className="absolute bottom-2 right-2 bg-green-900 text-white text-xs px-2 py-1 rounded hover:bg-green-800 transition">
                Voir plus
              </button>
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <img src="/src/assets/maïs jaune.png" alt="Maïs jaune" className="w-full h-40 object-cover" />
              <div className="absolute bottom-0 left-0 bg-[#FBC02D] text-black px-3 py-1 text-sm font-semibold">Maïs jaune</div>
              <div className="absolute top-2 right-2 bg-green-900 text-white px-2 py-1 text-xs rounded">8 000 GNF / kg</div>
              <button className="absolute bottom-2 right-2 bg-green-900 text-white text-xs px-2 py-1 rounded hover:bg-green-800 transition">
                Voir plus
              </button>
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <img src="/src/assets/manioc frais.png" alt="Manioc frais" className="w-full h-40 object-cover" />
              <div className="absolute bottom-0 left-0 bg-[#FBC02D] text-black px-3 py-1 text-sm font-semibold">Manioc frais</div>
              <div className="absolute top-2 right-2 bg-green-900 text-white px-2 py-1 text-xs rounded">10 000 GNF / kg</div>
              <button className="absolute bottom-2 right-2 bg-green-900 text-white text-xs px-2 py-1 rounded hover:bg-green-800 transition">
                Voir plus
              </button>
            </div>
          </div>
          <div className="flex justify-center mt-10">
            <button
              onClick={() => navigate('/annonces')}
              className="bg-[#35904F] text-white font-semibold px-8 py-3 rounded shadow hover:bg-[#4a7c5f] transition"
            >
              Voir plus
            </button>
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className="max-w-7xl mx-auto py-10">
        <img
          src="/src/assets/Rectangle 166.png"
          alt="Agriculture landscape"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </section>
      

      {/* Témoignages */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Ils nous font confiance</h2>
        <div className="flex flex-col md:flex-row justify-center space-x-0 md:space-x-8 space-y-8 md:space-y-0">
          <div className="bg-[#EBE9E9] rounded-lg p-6 flex flex-col items-center text-center shadow-md max-w-xs mx-auto">
            <img src="/src/assets/alpha.jpg" alt="Amara" className="w-20 h-20 rounded-full mb-4" />
            <h3 className="font-semibold">Amara, producteur de maïs</h3>
            <p className="text-gray-600 text-sm">“Grâce à AgriLink, je vends mes produits en toute simplicité.”</p>
          </div>
          <div className="bg-[#EBE9E9] rounded-lg p-6 flex flex-col items-center text-center shadow-md max-w-xs mx-auto">
            <img src="/src/assets/fao.jpg" alt="Moussa" className="w-20 h-20 rounded-full mb-4" />
            <h3 className="font-semibold">Moussa, producteur de manioc</h3>
            <p className="text-gray-600 text-sm">“Le site m’a aidé à trouver de nouveaux clients rapidement.”</p>
          </div>
          <div className="bg-[#EBE9E9] rounded-lg p-6 flex flex-col items-center text-center shadow-md max-w-xs mx-auto">
            <img src="/src/assets/poster.jpg" alt="Fatou" className="w-20 h-20 rounded-full mb-4" />
            <h3 className="font-semibold">Fatou, productrice</h3>
            <p className="text-gray-600 text-sm">“Simple, efficace et fiable.”</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[#EBE9E9] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-lg font-semibold mb-4 md:mb-0">
            Rejoignez AgriLink dès aujourd'hui et participez à la modernisation du marché agricole guinéen.
          </p>
          <button onClick={() => navigate('/register')} className="bg-[#35904F] text-white font-semibold px-8 py-3 rounded shadow hover:bg-[#4a7c5f] transition">
            Créer un compte gratuitement
          </button>
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

export default Accueil;
