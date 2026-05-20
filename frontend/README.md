# LivresGourmands — Frontend React

Application front-end du projet **livresgourmands.net** (Étape 3).

## Stack technique

- **React 18** + **Vite**
- **Bootstrap 5.3** + **Bootstrap Icons**
- **React Router v6** (routing + routes protégées)
- **Axios** (communication API REST)
- **Context API** + **localStorage** (panier + auth)

## Structure

```
src/
├── components/        Composants réutilisables
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── BookCard.jsx
│   └── CategoryCard.jsx
├── context/           Gestion d'état globale
│   ├── CartContext.jsx   Panier (localStorage)
│   └── AuthContext.jsx   Auth JWT
├── pages/             Pages de l'application
│   ├── HomePage.jsx
│   ├── ProductPage.jsx
│   ├── CartPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   └── AdminDashboard.jsx
├── services/
│   └── api.js         Axios + helpers API
├── App.jsx            Routes + providers
├── main.jsx           Point d'entrée
└── index.css          Charte graphique
```

## Lancement

1. S'assurer que l'API (étape 2) tourne sur `http://localhost:3000`

2. Installer les dépendances :
```bash
cd frontend
npm install
```

3. Lancer le serveur de développement :
```bash
npm run dev
```

L'application est disponible sur `http://localhost:5173`

## Pages

| Route | Page | Accès |
|-------|------|-------|
| `/` | Accueil | Public |
| `/product/:id` | Fiche produit | Public |
| `/cart` | Panier | Public |
| `/login` | Connexion | Public |
| `/register` | Inscription | Public |
| `/admin` | Dashboard admin | Admin / Gestionnaire |

## Charte graphique

- Rouge primaire : `#8B0000`
- Or / Doré : `#D4AF37`
- Fond crème : `#FFF5E4`
- Texte : `#333333`
- Polices : Poppins (titres) + Roboto (corps)
