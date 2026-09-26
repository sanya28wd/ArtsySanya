# ArtsySanya — Art, code, and colour

An interactive portfolio for Dubai-based artist and AI engineering student Sanya Wadhawan. The site brings a real studio practice together with creative computing: browse original artwork, explore pieces by colour, and play with a live generative canvas.

![Turquoise butterfly artwork from the ArtsySanya Art × AI collection](public/artworks/artxai-bg.png)

## The project

ArtsySanya is both an artist portfolio and a computer science project. It uses a typed artwork catalogue and a set of reusable React components to turn the artist’s collections into an interactive experience. The visual system pairs real artwork with shader-based colour fields, motion, and procedural canvas graphics.

The AI connection is explored through creative technology and visual computation. The current site does not call a generative AI service or claim that the artworks were AI-generated; instead, it shows how code, algorithms, and GPU-driven graphics can become part of an artist’s digital studio.

## Explore

- **Home** — an editorial studio introduction, selected works, and an Art × AI feature.
- **Gallery** — browse 35+ works, filter by medium or colour, search the catalogue, inspect details, and add pieces to an inquiry bag.
- **About** — learn about the handmade and computational sides of the practice.
- **Commissions** — explore custom work and send a project inquiry.
- **Creative Code Playground** — move a pointer or finger across the canvas to create a living particle drawing. Change radial symmetry and colour palettes in real time.
- **Shader-lit artwork frames** — React Three Fiber and Three.js render animated colour fields behind selected works. Scroll and pointer interactions add a subtle sense of depth.

## Creative Code Playground

The playground is a small, interactive graphics system built with the Canvas 2D API. Pointer movement seeds particles; each particle is reflected around a selectable number of radial segments to create symmetrical, evolving patterns. Particles fade over time, and a gentle ambient motion keeps the canvas alive when it is idle. The palette controls change the colours without leaving the page.

This is a hands-on example of programming concepts used in visual computing:

- polar coordinates, angles, and rotational symmetry
- particle state, velocity, and lifetimes
- animation frames and time-based rendering
- pointer and touch input
- palette-driven rendering and interactive state
- viewport-aware animation to avoid unnecessary work off screen

## Technology

- **Next.js App Router**, **React**, and **TypeScript** for the site and typed content model
- **React Three Fiber** and **Three.js** for real-time shader scenes
- **ShaderGradient** for GPU-animated gradient surfaces
- **Motion** for interaction and scroll-linked movement
- **Canvas 2D** for the generative particle playground
- **CSS** for responsive layouts, colour treatments, and reduced-motion support

There is no database or AI API required to run the site. Artwork metadata lives in `lib/artworks.ts`, and optimised local media lives in `public/artworks/`.

## Run locally

Use Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project checks

```bash
npm run lint
npm run validate:catalog
npm run build
```

## Project map

```text
app/                       Routes and global styles
components/                Gallery, inquiry, shader, and canvas experiences
lib/artworks.ts            Typed artwork catalogue and media paths
lib/colour.ts              Colour-family filtering helpers
public/artworks/           Local artwork images and process videos
public/vendor/liquid-glass/ Bundled liquid-glass UI styling and scripts
```

## Skills demonstrated

This project combines frontend engineering, typed data modelling, interactive graphics, visual design, and performance-aware animation. It demonstrates how a computer science and AI engineering background can support an art practice: algorithms generate patterns, shaders shape atmosphere, and interaction gives each collection a more expressive digital home.

---

Made with colour and code in Dubai, UAE.
