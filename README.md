# LOCACI

## Prérequis

- Node >= v14.17.0
- [PNPM](https://pnpm.io/installation) >= 6.16.0

## Stack : 


- Frontend
  - NextJS/React
  - headlessui -> composants modal, etc
  - tailwindcss -> css
  - react-aria/calendar + /daterangepicker -> composants pour les dates
  - mapbox -> manipulation des maps
- Backend
  - NextJS
  - tRPC -> logique
  - NextAuth -> authentification -> (outlook, facebook, google)
  - Quirrel -> queue jobbing (+ redis)

- Database
    - PostgresSQL -> geo (recherche dans une zone, un carré, un polygone, etc...)
- Recherche
    - typesense -> client (algolia, elasticsearch)

- externes
  - sentry -> Alertes erreurs
  - eversign -> signature documents
  - matomo (self-hosted) -> stocker analytics users
  - twilio -> send SMS


## 🚀 Comment travailler sur le projet ?

1. **Installer les dépendances**

   ```bash
   pnpm install --strict-peer-dependencies=false --shamefully-hoist
   ```

3. **Lancer le projet**

   ```bash
   pnpx run dev
   ```

   Une page va s'ouvrir a l'adresse http://localhost:3000 où vous pourrez voir toute la documentation
   des composants.

4. **Ouvrez le code source et commencez à coder! 😎**

## 🧐 Structure du projet

Un coup d'œil rapide sur les fichiers et répertoires de premier niveau que vous verrez dans ce projet.

    .
    ├── ui/
    └── web/
        ├── prisma/
        └── src/
            ├── pages/
            ├── server/
            │     └── router/
            └── lib/

1. **`ui`** : Ce dossier contient le package du design-system de locaci
1. **`web`** : Ce dossier contient l'application web faite avec nextjs
    1. **`prisma`** : Ce dossier contient le schema de la base de données 
    2. **`src`** : Ce dossier contient le code et la logique de notre app
       1. **`pages`** contient les pages de l'app
       2. **`server`** contient la logique backend de l'app
          1. **`router`** contient les controlleurs
       1. **`lib`** contient les utilitaires, fonctions et hooks

## 💫 Déployer le projet

ce projet est automatiquement déployé sur le VPS de csdev.
