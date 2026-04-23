# Flex Alignement — Site

Site statique du cabinet **Flex Alignement** (Geoffroy Bertrand, coach systémique stratégique).

Aucun build, aucune dépendance Node.js. HTML + CSS + JavaScript. Hébergeable partout (Vercel, Netlify, GitHub Pages, OVH, un Raspberry Pi).

---

## Structure

```
/
├── index.html                       ← Accueil
├── entreprises.html                 ← B2B (page prioritaire)
├── particuliers.html                ← B2C
├── approche.html                    ← Article long (pédagogique)
├── a-propos.html                    ← Portrait + parcours
├── contact.html                     ← Formulaires + Cal.com
├── mentions-legales.html
├── politique-confidentialite.html
├── robots.txt
├── sitemap.xml
├── /assets
│   ├── /css/main.css                ← TOUT le design system
│   └── /js
│       ├── main.js                  ← Interactions (nav, scroll, réticule)
│       └── diagrams.js              ← Diagrammes SVG (hero, cas clients)
└── /images
    ├── profil.jpeg                  ← Portrait /a-propos (affiché en NB via filtre CSS)
    └── Logo.png                     ← Favicon
```

---

## Comment éditer (sans toucher au code)

### Remplacer un chiffre `[À FOURNIR]`

Chaque chiffre qui doit venir de toi est encadré d'un visuel `[À FOURNIR]` (bordure pointillée gris).
Pour les remplacer tous d'un coup, cherche dans ton éditeur `placeholder` ou `[À FOURNIR]`.

**Chiffres à fournir actuellement :**

| Fichier | Chiffre attendu |
|---|---|
| `particuliers.html` (section 03) | Tarif séance individuelle, tarif séance couple |
| `mentions-legales.html` | SIRET, statut juridique, adresse, code APE, hébergeur |
| `contact.html` | Adresse complète du cabinet |
| `politique-confidentialite.html` | Outil de mesure d'audience (Plausible / Umami) |

Les placeholders LACT (800h · 2 ans), SYPRESS, Assurance Maladie, binôme Charles Moulette, ia.lact.fr et le parcours ingénieur sont désormais intégrés.

## Endpoints Calendly utilisés

| Endpoint | Usage sur le site |
|---|---|
| `/30min` | Cadrage entreprise · nav CTA par défaut · contact page |
| `/seance-decouverte` | Appel découverte 20 min · particuliers hero · particuliers section tarifs (gratuit) |
| `/seance-individuelle` | Réservation séance payante · particuliers tarifs individuel & couple |

Pour changer un endpoint, cherche `calendly.com/geoffbertrand/` dans tous les fichiers et remplace.

## Logo

Le logo « Cible » utilisé est `images/Logo_Coach.gif` (animé, 777 KB). Intégré dans le header à 40×40 px et dans le footer à 32×32 px. Pour changer :

- Remplace le fichier dans `images/` en gardant le nom, OU
- Cherche `images/Logo_Coach.gif` dans tous les fichiers et remplace le chemin

Note : l'animation GIF ne peut pas être mise en pause via CSS. Si un fallback statique pour `prefers-reduced-motion` devient nécessaire, il faudra servir une PNG du premier frame via `<picture>`.

### Changer un texte

Ouvre le fichier `.html` dans n'importe quel éditeur (VS Code, Sublime, TextEdit). Les textes sont entre les balises `<h1>`, `<h2>`, `<p>`. Ne touche pas aux attributs (`class="..."`, `data-...`).

### Changer une image

Dépose le fichier dans `/images`, puis remplace le chemin dans le HTML (`images/monFichier.jpg`).

- **Portrait `/a-propos`** : le seul portrait du site. Doit être un visage de près, regard direct. Le filtre CSS le passe automatiquement en noir et blanc contrasté. Idéalement 1600×2000 px.

### Changer les liens Calendly / e-mail

Cherche dans tous les fichiers :
- `calendly.com/geoffbertrand/30min` → ton lien Cal.com / Calendly
- `geoffbertrand@gmail.com` → ton adresse

### Changer la palette de couleurs

Toutes les couleurs sont centralisées dans `assets/css/main.css`, dans la section `:root` (tout en haut). Modifie les variables `--c-signal`, `--c-paper`, `--c-ink`. Toutes les pages se mettent à jour.

### Désactiver le curseur réticule

Dans `assets/js/main.js`, remplace `const canUseCursor = ...` par `const canUseCursor = false;`.

---

## Comment mettre en ligne

### Option 1 — Vercel (recommandé, 2 minutes)

1. Créer un compte sur [vercel.com](https://vercel.com) (gratuit).
2. Depuis la CLI : `npx vercel` dans ce dossier, puis suivre les instructions. Ou glisser-déposer le dossier sur le dashboard.
3. Configurer le domaine `flexalignement.fr` dans Vercel → Settings → Domains.

### Option 2 — Netlify

1. Créer un compte sur [netlify.com](https://netlify.com).
2. Glisser-déposer le dossier sur le dashboard, ou `npx netlify deploy --prod`.
3. Domaine dans Site settings → Domain management.

### Option 3 — GitHub Pages

1. Push sur GitHub.
2. Settings → Pages → Source : branche `main`, dossier `/`.

### Option 4 — Hébergeur classique (OVH, Infomaniak)

Copier tout le dossier via FTP dans `www/` ou `public_html/`.

---

## Mesure d'audience (recommandé)

Ajouter **Plausible** ou **Umami** (pas Google Analytics — RGPD-friendly, sans cookie, sans bandeau).

**Plausible** (payant, simple) : inscription sur plausible.io, ajouter ce tag dans chaque `<head>` avant la fermeture :

```html
<script defer data-domain="flexalignement.fr" src="https://plausible.io/js/script.js"></script>
```

**Umami** (gratuit si auto-hébergé) : voir umami.is.

---

## Accessibilité

- Navigation clavier complète, skip-link, focus visibles.
- Contraste AA vérifié sur toutes les combinaisons.
- `prefers-reduced-motion` respecté (curseur et animations désactivés).
- Lecteurs d'écran : tous les SVG ont `aria-hidden` ou `aria-label`, les formulaires ont des `<label>` associés.

---

## Diagrammes SVG — explication

La signature graphique du site.

- **Hero** (chaque page de landing) : diagramme de 7 nœuds qui s'anime au scroll. Code dans `assets/js/diagrams.js` → `renderHeroDiagram()`.
- **Cas clients** (entreprises.html) : paires avant / après, définies dans `CASE_SPECS` (JS). Pour ajouter un cas, duplique une variante et modifie les positions.
- **Concepts** (approche.html) : petites illustrations des notions clés. Variantes `loop`, `type12`, `system-focus`.

Les diagrammes sont dessinés en SVG pur — pas de librairie. Légers, rapides, accessibles.

---

## Roadmap (ce qu'il reste à décider / brancher quand tu veux)

- [ ] Remplacer les placeholders `[À FOURNIR]` (voir tableau plus haut)
- [ ] Choisir et installer Plausible ou Umami (au choix)
- [ ] Choisir : garder Calendly ou basculer sur Cal.com (open source, auto-hébergeable, RGPD-parfait)
- [ ] Mettre en place une vraie soumission de formulaire (actuellement : `mailto:` — fonctionne mais inélégant). Options :
  - **Formspree** (gratuit jusqu'à 50 messages / mois)
  - **Netlify Forms** (gratuit si hébergé sur Netlify)
  - **Resend** (si tu passes à Next.js plus tard)
- [ ] Ajouter éventuellement une section `/ressources` (articles, podcasts) — optionnel, phase 2
- [ ] OpenGraph : générer une image `og-image.png` 1200×630 et l'ajouter dans `<head>`

---

## Crédits techniques

- Typographies : **Geist** & **Geist Mono** (Vercel, open source, OFL)
- Diagrammes : vanilla SVG + vanilla JS
- Design system : fait maison — voir `DESIGN.md`
