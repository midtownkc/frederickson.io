# frederickson.io

Personal landing page for Maxwell Frederickson — served by GitHub Pages at
[www.frederickson.io](https://www.frederickson.io/).

A single splash screen linking to the résumé PDF, LinkedIn, and music. No
frameworks, no build step, no web fonts, no third-party requests.

```
index.html                          the page
404.html                            styled not-found, served by GitHub Pages
css/site.css                        all styles, token-driven
js/fireflies.js                     ambient fireflies (skipped for reduced-motion)
images/utrecht.jpeg                 backdrop
images/og-card.jpg                  1200×630 share card
images/favicon.svg                  monogram
MaxwellFredericksonResume2026.pdf   the résumé
```

## Preview locally

```sh
python3 -m http.server 8000
open http://localhost:8000
```

## Updating the résumé

Drop the new PDF in the repo root, delete the old one, and update the two
`href`s in `index.html` and `404.html`. Regenerate the share card if the title
line changes — see `images/og-card.jpg`.
