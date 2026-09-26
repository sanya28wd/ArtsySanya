# ArtsySanya — my art, with code and colour

Hi, I’m Sanya. I’m an artist and an AI and Computer Science student based in Dubai. I made this website as a home for my artwork and as a way to bring my studio practice together with the things I’m learning in code, creative computing, and AI.

![A turquoise butterfly from my Art × AI collection](public/artworks/artxai-bg.png)

## Why I built it

I wanted ArtsySanya to feel like exploring my work, rather than looking through a static list of images. I built the gallery around my own artwork, with ways to search and filter by collection or colour, inspect pieces, and save them to an inquiry bag. The About and Commissions pages share more of my process and make it easier to start a project with me.

Studying AI and Computer Science has changed how I think about making things. I enjoy the structure of an algorithm and the unpredictability of colour in equal measure. I use code here as another creative material: it helps me make patterns move, build interactive experiences, and bring a little more atmosphere to the work.

My artwork on this site is my own. The current website doesn’t use an AI image-generation service; the AI and CS connection is in the creative technology I’m exploring around my art.

## What you can explore

- **Home** — a studio introduction, a selection of my work, and an Art × AI feature.
- **Gallery** — browse 35+ pieces, search by title or medium, filter by collection or colour, inspect details, and save works to an inquiry bag.
- **About** — learn about the handmade and computational sides of my practice.
- **Commissions** — explore the kinds of custom work I take on and send me a project inquiry.
- **Creative Code Playground** — move your pointer or finger across the canvas to create a living, symmetrical particle drawing. You can change the symmetry and colour palette while it runs.
- **Shader-lit artwork frames** — I use React Three Fiber and Three.js to create animated colour fields behind selected artworks, with subtle depth as you scroll and move your pointer.

## My Creative Code Playground

I built the playground with the Canvas 2D API. When you move across the canvas, your pointer seeds particles. I reflect each particle around a chosen number of radial segments to create evolving, symmetrical patterns. The particles fade over time, and a small amount of ambient motion keeps the canvas moving when it’s idle. You can change the symmetry and palette as you play.

Building it gave me a way to explore programming through visuals. The playground brings together:

- polar coordinates, angles, and rotational symmetry
- particle position, velocity, and lifetime
- animation frames and time-based drawing
- pointer and touch interaction
- palette selection and interactive state
- viewport-aware rendering, so the animation can rest when it’s off screen

## How I built the site

- **Next.js App Router**, **React**, and **TypeScript** power the pages and typed artwork catalogue.
- **React Three Fiber** and **Three.js** render the shader scenes.
- **ShaderGradient** creates the animated gradient surfaces.
- **Motion** adds interface and scroll-linked movement.
- **Canvas 2D** powers my generative playground.
- **CSS** handles responsive layouts, colour, and reduced-motion support.

I keep the artwork details in `lib/artworks.ts` and the image and video files in `public/artworks/`. There’s no database or AI API needed to run the site.

## Run it locally

I use Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Checks I use

```bash
npm run lint
npm run validate:catalog
npm run build
```

## Where things live

```text
app/                       My routes and global styles
components/                Gallery, inquiry, shader, and canvas experiences
lib/artworks.ts            My typed artwork catalogue and media paths
lib/colour.ts              Colour-family filtering helpers
public/artworks/           My artwork images and process videos
public/vendor/liquid-glass/ Bundled liquid-glass UI styling and scripts
```

## What I’m learning through this project

Building ArtsySanya lets me bring together frontend engineering, TypeScript, visual design, and interactive graphics. It’s also a way for me to explore how my AI and Computer Science studies can inform my art practice: algorithms help me build patterns, shaders shape colour and atmosphere, and interaction gives people a more personal way to explore my work.

---

Made with colour and code by me in Dubai, UAE.
