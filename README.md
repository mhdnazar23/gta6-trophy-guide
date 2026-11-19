# gta6-trophy-guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/mhdnazar23/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/mhdnazar23/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Platinum Road — a complete, offline trophy guide for Grand Theft Auto VI on PlayStation 5: all 55 official trophies, a checklist that saves in your browser, a five-stage roadmap to the platinum, and a missables page that only calls a trophy missable when a source confirms it.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. No build step, no network requests — the app is plain static files in `app/`, and the trophy list is `app/data/trophies.json`.

To build the entry dossier the grader reads:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## What is inside

- **Checklist** — all 55 official trophies (1 platinum, 2 gold, 6 silver, 46 bronze, 28 hidden), with a guide in our own words for every one, a per-trophy note field, search, grade and kind filters, and an earned-only view.
- **Saved progress** — ticks and notes live in localStorage, with export and import as JSON.
- **Spoiler setting** — on by default, it hides the name, description and guide of hidden story trophies until you earn them.
- **Roadmap** — five stages: story first, stranger strands, activities, collectibles and exploration, then robberies, money and cleanup to 100% completion.
- **Missables** — honest about what is not known yet. Only Positive Mental Attitude is reported as potentially missable (the Chapter 1 balcony meditation spot, reported by early guides, not yet confirmed). Everything else is listed as doable after the story, as far as the official descriptions show.

## Sources

- Exophase — official trophy names, descriptions and grades.
- PSNProfiles — grades and PSN progress targets.
- PlanetGTA6, OutputLag, KeenGamer and PowerPyx — early-guide reports, used only where labelled "reported, not yet confirmed".

Trophy names, descriptions and grades are exactly as PlayStation publishes them. The guides are written in our own words from those official descriptions; where a place or step is not pinned down by the official description, the guide says so instead of inventing one. This is an unofficial fan guide, not affiliated with Rockstar Games or Take-Two Interactive, and it uses no Rockstar logo or official artwork.

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
