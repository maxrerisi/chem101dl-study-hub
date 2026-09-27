# Chem 101DL Study Hub

A lightweight, static study web app for Duke's **Chem 101DL — Core Concepts in Chemistry** (Fall 2026). Built from the course syllabus, learning outcomes, and exam formula sheet: 8 units, each with a formula/concept reference, interactive calculators, and randomized practice problems.

No build step, no backend, no dependencies — it's plain HTML/CSS/JS.

## Using it

Just open `index.html` in a browser, or serve the folder with any static file server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## What's inside

- **Home** — links into all 8 units
- **Per-unit pages** (Quantum Mechanics, Bonding, Hybridization/MO Theory, Kinetics, Thermochemistry, Equilibrium, Acids & Bases, Entropy/Free Energy), each with:
  - **Reference** — exam formula-sheet equations plus condensed key-concept notes for that unit
  - **Calculators** — solve-for-any-variable tools for that unit's formulas (e.g. integrated rate laws, ICE tables, pH/pOH/Ka/Kb conversions, Gibbs free energy)
  - **Practice** — randomized problem generators with instant checking and worked solutions
- **Periodic Table & Constants** — a full clickable periodic table plus the physical constants and conversions from the formula sheet

## Structure

```
index.html              shell + navigation mount
css/style.css            styling
js/app.js                hash router
js/ui.js                 shared UI helpers (solver builder, practice engine)
js/data/                 unit content, constants, periodic table data
js/calculators/          one file per unit's calculators
js/practice/             one file per unit's randomized practice generators
```

## Deploying on Coolify

The repo includes a `Dockerfile` (nginx:alpine serving the static files) plus an `nginx.conf`, so Coolify can build and run it directly:

1. In Coolify, create a new **Application** resource and point it at this repo/branch.
2. Build pack: **Dockerfile** (auto-detected).
3. Port: **80** (already `EXPOSE`d in the Dockerfile).
4. No environment variables or persistent storage are needed — it's a static site.
5. Deploy. Coolify will build the image and route your configured domain to port 80.

To build/run it locally the same way Coolify would:

```bash
docker build -t chem101-hub .
docker run -p 8080:80 chem101-hub
# then visit http://localhost:8080
```

## Note on course materials

The original syllabus, learning outcomes, and formula sheet PDFs used to build this are **not** included in this repo (see `.gitignore`) — the syllabus states course materials are copyrighted and prohibits redistribution. All reference content here has been independently rewritten/condensed for study purposes.
