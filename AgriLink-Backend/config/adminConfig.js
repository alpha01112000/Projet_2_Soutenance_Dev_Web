module.exports = {
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@agrilink.com',
    password: process.env.ADMIN_PASSWORD || 'admin123',
    secretKey: process.env.ADMIN_SECRET_KEY || 'agrilink-admin-secret-2024'
  }
};
