# LOCACI

![logo locaci](web/public/logo.svg)

## Prérequis

- Node >= v14.17.0
- [PNPM](https://pnpm.io/installation) >= 6.16.0

## 🚀 Comment travailler sur le projet ?

1. **Installer les dépendances**

   ```bash
   pnpm install --strict-peer-dependencies=false --shamefully-hoist
   ```

3. **Lancer le projet**

   ```bash
   pnpm run dev
   ```

   Une page va s'ouvrir a l'adresse http://localhost:3000 où vous pourrez voir l'app nextjs.

4. **Ouvrez le code source et commencez à coder! 😎**

## 🧐 Structure du projet

Un coup d'œil rapide sur les fichiers et répertoires de premier niveau que vous verrez dans ce projet.

    .
    ├── ui/
    └── web/
        ├── prisma/
        └── src/
            ├── app/
            ├── server/
            │     └── router/
            ├── lib/
            └── features/

1. **`ui`** : Ce dossier contient la librairie des composants de locaci 
2. **`web`** : Ce dossier contient l'application web faite avec nextjs
    1. **`prisma`** : Ce dossier contient le schema de la base de données 
    2. **`src`** : Ce dossier contient le code et la logique de notre app
       1. **`app`** contient les pages de l'app
       2. **`server`** contient la logique backend de l'app
          1. **`router`** contient les controlleurs
       3. **`lib`** contient les utilitaires et fonctions
       4. **`features`** contient les composants et hooks corresponds à chaque fonctionnalité de LOCACI

## 💫 Déployer le projet

ce projet est automatiquement déployé sur le VPS de csdev.
