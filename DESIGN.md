# DESIGN.md — « L'INSTRUMENT »

Direction artistique du site Flex Alignement.
Ce document explique les choix, pour que tu puisses les faire évoluer avec n'importe quel designer sans perdre l'esprit.

---

## Parti-pris central

Le site ne se présente pas comme un site de coach. Il se présente comme un **instrument de précision** — proche d'un logiciel professionnel, d'un protocole médical, d'une cartographie de système.

**Ce que le site vend, il l'incarne :**
- Rigueur systémique → diagrammes SVG partout.
- Précision → métadonnées en mono, chiffres, numérotation protocolaire.
- Sobriété → 4 couleurs, une typographie, zéro décor parasite.

**Les adjectifs sont remplacés par des chiffres.**
**Les photos sont remplacées par des schémas.**
**Les ornements sont remplacés par des données.**

---

## Tokens — le système, en 40 lignes

Toutes les valeurs du design sont centralisées dans `assets/css/main.css`, section `:root`. Tout le reste en découle.

### Palette — 4 couleurs

| Variable | Hex | Rôle |
|---|---|---|
| `--c-paper` | `#F2EFE9` | Fond primaire. Blanc lin, chaud, papier-ingénieur. |
| `--c-ink` | `#0F0E0C` | Encre principale. Texte long, titres, bordures. |
| `--c-signal` | `#3D6B52` | **Vert oxyde.** Couleur signal — CTA, état actif, indicateurs. Utilisée chirurgicalement. |
| `--c-system` | `#8B867C` | Gris système. Métadonnées mono, labels secondaires. |

**Pourquoi le vert plutôt que l'orange** : stabilité, santé, ancrage, « monde de demain ». L'orange est plus urgence/alarme — mauvais registre pour un coach senior. Le vert oxyde se marie aussi mieux avec le fond lin.

### Typographie

| Famille | Rôle | Source |
|---|---|---|
| **Geist** | Display, corps, UI | [vercel.com/font](https://vercel.com/font) — OFL |
| **Geist Mono** | Métadonnées, labels, numérotation | idem — OFL |

Chargées actuellement via Google Fonts CDN. Pour production, auto-héberger dans `/assets/fonts`.

**Règles strictes :**
- Aucune serif. (Ce n'est pas un magazine.)
- Aucune italique. Le *mise en valeur* passe par le `font-weight`, les capitales ou la signal color.
- Corps : `line-height: 1.6–1.7`, `measure: 65–75 caractères` (~56ch pour les textes longs).

### Espacement & grille

- Grille 12 colonnes, gouttière 24 px.
- Conteneur principal : `1200px` max.
- Prose (articles longs) : `680px` max.
- Espacement vertical entre sections : `clamp(80px, 9vw, 144px)` en desktop, `60px` en mobile. **Ferme, pas aéré façon brochure.**

### Motion

- Ease principal : `cubic-bezier(0.2, 0, 0, 1)` — ferme, pas spring-bounce.
- Durées : 180 / 280 / 520ms.
- Toute animation respecte `prefers-reduced-motion`.

---

## Les 10 signatures visuelles

| # | Signature | Implémentation |
|---|---|---|
| **01** | Hero = diagramme systémique vivant | `data-hero-diagram` + `renderHeroDiagram()` dans `diagrams.js`. 7 nœuds qui se réorganisent au scroll. |
| **02** | Études de cas = schémas avant / après | `data-case-diagram="conflict-before"`, etc. 6 variantes hand-crafted dans `CASE_SPECS`. |
| **03** | Sections numérotées comme un protocole | `.section-number` : `01 — TITRE` en mono. |
| **04** | Métadonnées en mono sous chaque section | `.mono-line` : `DURÉE · 8 À 12 SÉANCES · FORMAT · VISIO`. |
| **05** | Chiffres partout, adjectifs nulle part | `.placeholder` pour les chiffres à fournir (bordure pointillée). |
| **06** | Barre d'état en pied de page | `.statusbar` avec point vert pulsant (`--c-signal`). |
| **07** | Un seul portrait, caché, puissant | Uniquement `a-propos.html`. Filtre CSS `grayscale(1) contrast(1.12)`. |
| **08** | Curseur réticule sur desktop | `.cursor-reticle` en `mix-blend-mode: difference`. Désactivé sur tactile et `prefers-reduced-motion`. |
| **09** | Grille d'ingénieur en arrière-plan | `.grid-bg` sur les hero. `rgba(15,14,12,0.025)` — quasi invisible mais présent. |
| **10** | Zéro décor parasite | Pas de blobs, pas de gradients, pas de glass, pas d'emoji, pas d'icônes décoratives. |

---

## Philosophie en 3 tests

À chaque décision (ajout, modification, refonte) :

1. **Est-ce qu'un·e DG sérieux·se et un·e particulier·e en souffrance peuvent tous les deux se sentir légitimes ici ?**
2. **Est-ce que cet élément ressemble à une brochure ou à un instrument ?** Si brochure → retirer.
3. **Est-ce qu'un·e DRH aguerri·e se dit "cette personne sait ce qu'elle fait" en moins de 30 secondes ?**

Si les trois réponses sont oui, on est bon.

---

## Interdits (à ne jamais réintroduire)

- Serifs, italiques, dégradés, glassmorphism, ombres portées décoratives.
- Photos de banque (poignée de main, équipe souriante, laptop).
- Blobs, vagues SVG, illustrations figuratives.
- Icônes 3D, emojis dans les titres/CTA.
- Carrousel automatique.
- Pop-up newsletter.
- Chatbot.
- Citations inspirantes décontextualisées (Brené Brown & co). Les seules citations autorisées viennent du corpus Palo Alto / Nardone / de Shazer.
- Compteur « +127 clients accompagnés » (ringard).
- Logos clients défilants en bandeau.
- Blog vide.
- Palette étendue. 4 couleurs, point.

---

## Comment faire évoluer sans casser l'esprit

### Ajouter un cas client

Dans `assets/js/diagrams.js`, dans `CASE_SPECS`, duplique une variante et modifie les positions des nœuds. Puis dans `entreprises.html`, ajoute un `<article class="case">` en copiant un existant.

### Changer la couleur signal

Modifie `--c-signal`, `--c-signal-hi`, `--c-signal-lo` dans `main.css`. Tout le reste suit. Fais attention à garder un contraste AA avec le fond lin.

### Ajouter une page

Duplique `particuliers.html` (c'est la plus neutre). Garde header + footer. Change `<title>`, `<meta description>`, et le contenu de `<main>`. Ajoute l'URL dans `sitemap.xml`.

### Ajouter un concept illustré

Ajoute une variante dans `renderConceptDiagram()` (`diagrams.js`) avec un nom comme `"recursion"` ou `"boundary"`. Puis dans le HTML : `<svg data-concept-diagram="recursion"></svg>`.

---

## Évolutions v4.1 (23 avril 2026)

Cette itération a injecté l'identité de marque complète sans toucher au design system :

- **Logo Cible** (`images/Logo_Coach.gif`) intégré dans le header et le footer. Slot `.nav-brand__logo` + composant `.brand-inline`.
- **Citation signature** (nouveau composant `.signature-quote`) : crédo personnel de Geoffroy placé sur `/a-propos` juste après l'intro bio.
- **Bande accréditations** (nouveau composant `.creds-strip`) sous chaque hero : LACT · 800 h · SYPRESS · Assurance Maladie · ingénieur IA.
- **Présentation binôme** (nouveau composant `.duo-card`) : Geoffroy + Charles Moulette sur `/entreprises` et `/a-propos`, strictement pour les missions d'entreprises en difficulté.
- **Bloc ia.lact.fr** sur `/a-propos` + lien dans le footer de toutes les pages.
- **Refonte /approche** dans l'esprit Watzlawick : paradoxes du quotidien (`.paradox-strip`), métaphores thermostat et mobile (`.metaphor`), histoire transformatrice du couple qui se dispute, chute finale « vous êtes à la fois le problème ET la solution ».
- **Différenciation ingénieur** : positionnement « Le premier systémicien qui pense en ingénieur » amené sur home + /a-propos + /entreprises.
- **Bug image corrigé** : `images/profil.jpeg` → `images/profil_picture.jpeg` sur `/a-propos`.
- **3 endpoints Calendly** différenciés : `/30min` (cadrage), `/seance-decouverte` (appel gratuit), `/seance-individuelle` (séance payante).

## Dette assumée / à envisager plus tard

- **Polices** : actuellement Google Fonts CDN. Pour perfection RGPD et performance, auto-héberger dans `/assets/fonts`.
- **Formulaires** : `mailto:` — basique. Passer à Formspree / Netlify Forms / Resend selon l'hébergeur choisi.
- **Analytics** : rien n'est branché. Ajouter Plausible ou Umami (voir README).
- **OG images** : pas encore générées. Image 1200×630 à créer pour chaque page (ou une seule pour tout le site).
- **Mode sombre** : non implémenté. Si souhaité, inverser `--c-paper` et `--c-ink`, garder le signal. Simple à rajouter via `@media (prefers-color-scheme: dark)` ou `[data-theme="dark"]`.

---

## Références silencieuses du design

Pour les futur·es designers qui reprendraient le projet :

- **Logiciel pro 2026** : Linear, Vercel, Raycast, Arc, Cursor — interface dense, mono-typography, zéro décor.
- **Imprimé scientifique** : papiers IEEE, manuels de vol, protocoles opératoires — sections numérotées, métadonnées en marge.
- **Cartographie de systèmes** : diagrammes Sankey, graphes de dépendances, schémas électrotechniques.

**Le site, quand il est réussi, ressemble davantage à un dashboard calme qu'à une brochure.** Si un jour il recommence à ressembler à une brochure, c'est qu'on a dérivé.
