# SciencesPass

SciencesPass est une application web permettant de simuler et calculer ses moyennes selon des règles de validation complexes. Elle est particulièrement adaptée pour les établissements d'enseignement supérieur ayant des systèmes de notation spécifiques.

## Fonctionnalités

- Gestion des UE (Unités d'Enseignement) et des matières
- Système de coefficients personnalisables
- Règles de validation configurables :
  - Moyenne minimale globale
  - Nombre minimum d'UE validées
  - Nombre maximum d'échecs autorisés
- Template pré-configuré pour Sciences Po Bordeaux
- Interface responsive (desktop & mobile)
- Persistance des données dans le navigateur

## Technologies

- Vue 3 + Nuxt 3
- TypeScript
- Pinia pour la gestion d'état
- TailwindCSS pour le style
- ShadcnUI pour les composants

## Développement

### Installation

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

### Serveur de développement

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

### Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

### LICENSE

AGPL-3.0 License
