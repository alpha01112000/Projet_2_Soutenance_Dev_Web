require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminAuthRoutes'); // Routes d'administration fusionnées
const adminSuperRoutes = require('./routes/adminSuperRoutes'); // Routes super admin
const annonceRoutes = require('./routes/annonceRoutes');
const produitRoutes = require('./routes/produitRoutes');
const contactRoutes = require('./routes/contactRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques du dossier uploads
app.use('/uploads', express.static('uploads'));

const connectDB = require('./config/db');

// Connect to the database
connectDB();

// Routes
app.use('/api/auth', authRoutes);  // Pour /api/auth/register et /api/auth/login
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/super', adminSuperRoutes);
app.use('/api/annonces', annonceRoutes);
app.use('/api/produits', produitRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/messages', messageRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AgriLink API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

// Export the app for testing purposes
module.exports = app;

// Start the server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  });
}
