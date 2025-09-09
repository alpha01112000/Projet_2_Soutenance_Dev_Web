# AgriLink Backend (MVP)
- Node.js / Express / MongoDB / JWT
- Démarrage:
  1) Crée `.env` (voir exemple).
  2) `npm install`
  3) `npm run dev`
- Routes clés:
  - Auth: POST /api/auth/register, /api/auth/login, GET /api/auth/me
  - Annonces: CRUD /api/annonces
  - Produits: GET /api/produits (search, filtres)
  - Contact: POST /api/contact
  - Admin: GET /api/admin/stats (role admin)

