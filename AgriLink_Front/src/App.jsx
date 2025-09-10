import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Accueil from './Composants/pages/Accueil';
import APropos from './Composants/pages/A propos';
import FAQ from './Composants/pages/FAQ';
import Annonces from './Composants/pages/Annonces';
import AnnonceDetail from './Composants/pages/AnnonceDetail';
import Contact from './Composants/pages/Contact';
import Login from './Composants/pages/Login';
import PublierAnnonce from './Composants/pages/PublierAnnonce';
import Register from './Composants/pages/Register';
import TableauDeBordWithHeader from './Composants/pages/TableauDeBordWithHeader';
import './App.css';

// Configure axios base URL
axios.defaults.baseURL = 'http://localhost:3000';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/apropos" element={<APropos />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/annonces" element={<Annonces />} />
        <Route path="/annonces/:id" element={<AnnonceDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/publier-annonce" element={<PublierAnnonce />} />
        <Route path="/tableau-de-bord" element={<TableauDeBordWithHeader />} />
      </Routes>
    </Router>
  );
}

export default App;
