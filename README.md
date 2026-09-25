# ArtsySanya

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Update artwork details

Edit `lib/artworks.ts`. Every artwork has editable `title`, `medium`, `year`, `dimensions`, and `price` fields. Keep unavailable details as `null`; the website will show “Enquire for details”.

To add a prepared image, place it in `public/artworks` and use its path in the artwork record. The source artwork archive remains in `art` and can be reprocessed with:

```bash
scripts/prepare-art-assets.sh
```

Validate the catalogue and create a production build with:

```bash
npm run validate:catalog
npm run build
```
