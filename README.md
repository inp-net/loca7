<div align="center">
  <img width="300" src="public/loca7-wordmark.svg">
  <br>
  <a href="https://wakatime.com/@ewen_lbh/projects/adljqhspbi"><img src="https://wakatime.com/badge/user/0054cecb-dd63-44eb-9e94-ed53ccb8506a/project/92917f76-b95c-4e47-bc96-986e5e983a37.svg" alt="wakatime"></a>
  <a href="https://loca7.vercel.app"><img src="https://vercelbadge.vercel.app/api/ewen-lbh/loca7"></a>
<img alt="W3C Validation" src="https://img.shields.io/w3c-validation/html?targetUrl=https%3A%2F%2Floca7.vercel.app&label=w3c%20validation">
</div>

Loca7 est le site de recherche de logement pour les étudiants de l'ENSEEIHT.

Il propose une inteface permettant de rechercher les logements, de poster des annonces et de les gérer. Il propose également une interface administrateur.

## Prototype de l'interface

Un [prototype de l'interface](https://www.figma.com/file/Y6xMoifKInWIAGuGGdZp49/loca7?node-id=0%3A1&t=UtmI53RLcQkMtKkV-1) est disponible sur _Figma_.

Il y a également une copie locale importable dans figma, au nom de `/prototype.fig`.

## Développement

Il faut un serveur PostgreSQL installé et démarré.

```bash
git clone https://git.inpt.fr/INP-net/loca7
cd loca7
npm i # ou pnpm, ou yarn
# remplacer user et password, ainsi que 5432 par le port de votre serveur postgresql
echo "DATABASE_URL=postgres://user:password@localhost:5432/loca7" > .env
npm run pushdb
npm run dev
```

## Roadmap

### Recherche

- [x] Intégration avec [OpenStreetMap](https://www.openstreetmap.org) via [leafletJS](https://leafletjs.com)
- [x] Filtrage par type de logement, surface, prix, présence de parking, meublé, etc.
- [x] Tri par prix, surface, distance à l'ENSEEIHT, etc.
- [ ] Temps de trajet avec l'n7, à pied, à vélo et en transports (calculé depuis l'adresse du logement avec [TravelTime](https://docs.traveltime.com/api/) (l'API de [Nomatim]() n'a pas les transports en commun))

### Post d'annonces

- [ ] Champ de description en texte riche WYSIWYG (pas de BBCode)
- [x] Autocomplétion pour l'adresse (permet de récupérer lat et long pour l'appartement) via l'API d'Open Street Map, [Nomatim](https://nominatim.org/release-docs/develop/)
      (à self-hoster pour faire de l'auto-complétion, ils rate-limite à 1 req/s, trop peu si plusieurs utilisateur en même temps même avec un debounce)
- [x] Filepicker pour les photos avec gestion du glisser-déposer

### Gestion des annonces

- [x] Liste des annonces, bouton pour déposer si aucune annonce, avec une vue liste presque comme l'interface utilisateur mais en moins compacte

### Comptes

- [ ] Intégration avec le LDAP
- [ ] Intégration avec [Google reCaptcha v3](https://developers.google.com/recaptcha/docs/v3) à la création et à la connexion
- [x] Évaluation de la complexité d'un mot de passe avec [zxcvbn](https://github.com/dropbox/zxcvbn)

### Notifications par mail

- [ ] Notifications pour les administrateurs
- [ ] Notifications pour les propriétaires
- [ ] Possibilité de mettre “à l'écoute” les logements respectant des critères et de recevoir un mail quand un nouveau logement correspondant à ceux-ci est posté

### Interface administrateur

- [ ] Vue liste avec même fonctionnalités que la recherche mais:
  - Plus compacte
  - Avec des actions pour les admins: supprimer, rendre obsolète/remettre visible
  - Montrer/cacher les obsolètes, les afficher en grisé

## Stack

- [Svelte](https://svelte.dev) pour le frontend
- [SvelteKit](https://kit.svelte.dev) pour le backend
- [PostgreSQL](https://postgresql.org) pour la base de données
- [MJML](https://mjml.io) pour la génération d'e-mails

## Architecture

> Architecture standard de projets SvelteKit

- **public/** fichiers statiques (logos, favicons, etc)
- **src/lib/** composants
- **src/routes/** pages

## Temps passé

- **Prototype d'interface:** 16 heures
- **Programmation:** [![wakatime](https://wakatime.com/badge/user/0054cecb-dd63-44eb-9e94-ed53ccb8506a/project/92917f76-b95c-4e47-bc96-986e5e983a37.svg)](https://wakatime.com/@ewen_lbh/projects/adljqhspbi)
