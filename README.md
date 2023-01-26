<p align="center">
    <img width="300" src="static/loca7-wordmark.svg">
</p>

Loca7 est le site de recherche de logement pour les étudiants de l'ENSEEIHT.

Il propose une inteface permettant de rechercher les logements, de poster des annonces et de les gérer. Il propose également une interface administrateur.

## Roadmap

### Recherche

- [ ] Intégration avec [OpenStreetMap](https://www.openstreetmap.org) via [mapbox](https://labs.mapbox.com/mapping)
- [ ] Filtrage par type de logement, surface, prix, présence de parking, meublé, etc.
- [ ] Tri par prix, surface, distance à l'ENSEEIHT, etc.

### Post d'annonces

- [ ] Champ de description en texte riche WYSIWYG (pas de BBCode)
- [ ] Filepicker pour les photos avec gestion du glisser-déposer

### Gestion des annonces

- [ ] 

### Comptes

- [ ] Intégration avec le LDAP
- [ ] Intégration avec [Google reCaptcha v3](https://developers.google.com/recaptcha/docs/v3) à la création et à la connexion

### Notifications par mail

- [ ] Notifications pour les administrateurs
- [ ] Notifications pour les propriétaires
- [?] Possibilité de mettre “à l'écoute” les logements respectant des critères et de recevoir un mail quand un nouveau logement correspondant à ceux-ci est posté

### Interface administrateur

- [ ]


## Stack

- [Svelte](https://svelte.dev) pour le frontend
- [Django](https://djangoproject.com)+[DRF](https://django-rest-framework.org) pour le backend
- [PostgreSQL](https://postgresql.org) pour la base de données
- [MJML](https://mjml.io) pour la génération d'e-mails

## Architecture

- **static/** fichiers statiques (logos, favicons, etc)
- **loca7/** backend
    - **app/** connexion avec le frontend
    - **data/** API
    - **notifications/** gestion des notifications par mail
- **front/** frontend
