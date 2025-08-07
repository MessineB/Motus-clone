# 🟥🟨🟦 SUTOM Web Clone – MVP

Un clone du jeu SUTOM , en Next.js + NestJS + PostgreSQL. Ce projet a pour objectif de proposer une version simple, jouable immédiatement, avec enregistrement facultatif du joueur à la fin de la partie.

---

## 🚀 Technologies utilisées

- **Frontend** : [Next.js](https://nextjs.org/) (React)
- **Backend** : [NestJS](https://nestjs.com/)
- **Base de données** : PostgreSQL
- **ORM** : Prisma ou TypeORM
- **Tests** : Jest
- **Cookies** : Pour stocker le nom du joueur

---

## 🎯 Objectif du MVP

- ✅ Un utilisateur peut jouer au SUTOM sans inscription
- ✅ Un mot du jour est proposé, avec sa première lettre révélée
- ✅ L'utilisateur a 6 tentatives
- ✅ Feedback visuel après chaque essai :
  - 🔴 Lettre bien placée
  - 🟡 Lettre présente mais mal placée
  - 🔵 Lettre absente (fond bleu)
- ✅ À la fin de la partie, le joueur peut saisir un nom unique
- ✅ Le nom est stocké en cookie et en base de données avec le résultat
- ✅ Aucun autre utilisateur ne peut enregistrer un nom déjà existant

---

## 🧱 API – Backend NestJS

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/word` | `GET` | Récupère le mot du jour (1re lettre + longueur) |
| `/api/validate` | `POST` | Valide une tentative de mot et retourne un tableau de couleurs |
| `/api/register` | `POST` | Enregistre un nom de joueur et son score |
| `/api/check-name/:name` | `GET` | Vérifie si le nom existe déjà |

---

## 🗃️ Modèle de base de données (Proposition)

### `User`
- `id: string (UUID)`
- `name: string` (unique)
- `createdAt: Date`

### `Game`
- `id: string`
- `userId: string` (nullable si non enregistré)
- `date: Date`
- `attempts: string[]` (JSONB)
- `status: 'WIN' | 'LOSE'`
- `tries: number`

### `Word`
- `id: string`
- `value: string`
- `date: Date`

---

## 🖼️ Frontend – Composants clés

- `GameGrid` : grille de lettres avec feedback couleur
- `Keyboard` : clavier visuel
- `WordHint` : affichage 1re lettre et nombre de lettres
- `EndGameModal` : entrée du nom à la fin
- `FeedbackEngine` : compare les mots et retourne les couleurs

---

## 📦 Fonctionnalités futures (post-MVP)

- Authentification complète (email, Google, etc.)
- Statistiques personnelles
- Classement global
- Mode multijoueur
- Choix du thème
- Responsive/mobile optimisé

---

## 🍪 Gestion des cookies

- Le nom saisi est stocké dans un cookie (`username`)
- À la prochaine visite, le nom est détecté automatiquement

---

## ▶️ Lancer le projet (prochainement)

```bash
# Backend NestJS
cd backend
npm install
npm run start:dev

# Frontend Next.js
cd frontend
npm install
npm run dev
