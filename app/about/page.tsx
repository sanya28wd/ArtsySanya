import Image from "next/image";
import Link from "next/link";
import { CreativeLineStudy } from "@/components/creative-line-study";
import { ShaderGradientPanel } from "@/components/shader-gradient-panel";
import { publicAsset } from "@/lib/site";

export const metadata = { title: "About — Sanya Wadhawan" };

const dualDisciplines = [
  {
    title: "Handmade Craft",
    subtitle: "The Meditative Physical Discipline",
    items: ["Painted Glass Bottles", "Acrylic Canvas", "Rangoli & Ceremonial Powders", "Resin & Mixed Media", "Intricate Ink Mandalas"],
    tag: "Studio Practice"
  },
  {
    title: "AI & Computer Science",
    subtitle: "The Algorithmic Virtual Medium",
    items: ["Generative Geometry & Shaders", "Polar Coordinate Mandalas", "Interactive Web Visualizers", "Digital Illustration & Color Theory", "Creative Tech Prototyping"],
    tag: "Engineering & Code"
  }
] as const;

export default function AboutPage() {
  return (
    <main className="page-shell about-page-shell">
      <section className="about-hero">
        <div className="about-hero-copy">
          <p className="eyebrow">Artist · Maker · AI & CS Engineering Student</p>
          <h1>
            Hello, I am <i>Sanya.</i>
          </h1>
          <p className="large-copy">
            ArtsySanya is my way of collecting moments in colour. I move between patient
            handcraft—mandalas, rangoli, resin, painted bottles, and canvas—and the
            open-ended experimentation of digital art and creative engineering.
          </p>
        </div>
        <figure className="about-hero-art">
          <ShaderGradientPanel palette="about" />
          <div className="hero-artwork-frame">
            <Image
              src={publicAsset("/artworks/turquoise-metamorphosis.jpg")}
              alt="Turquoise butterfly wing digital artwork"
              fill
              priority
              sizes="(max-width: 800px) 100vw, 42vw"
            />
            <figcaption>Colour, pattern, and a little bit of wonder.</figcaption>
          </div>
        </figure>
      </section>

      <section className="about-grid">
        <div>
          <p className="eyebrow">The point of view</p>
          <h2>Art should make a space feel more like its people.</h2>
        </div>
        <div>
          <p>
            I am based in Dubai and currently ship within the UAE. I love the exacting,
            meditative side of making just as much as the joyful, unpredictable one: a crisp
            ink line, a pile of rangoli powder, a bottle that becomes a character, or a canvas
            that changes an entire room.
          </p>
          <p>
            Alongside my studio art practice, I study AI and Computer Science. For me, code and
            canvas aren&apos;t opposites—both require deep patience, attention to structure, and
            the courage to build complex worlds starting from a single point or line of logic.
          </p>
          <div className="about-actions">
            <Link className="button button-dark" href="/gallery">
              Explore the collection
            </Link>
            <Link className="text-link" href="/commissions">
              Work with me ↗
            </Link>
          </div>
        </div>
      </section>

      {/* Duality Section: Art + CS */}
      <section className="about-matrix-section">
        <div className="matrix-header">
          <p className="eyebrow">The Convergence</p>
          <h2>Two disciplines. <i>One creative vision.</i></h2>
        </div>
        <CreativeLineStudy />
        <div className="matrix-grid">
          {dualDisciplines.map((d) => (
            <article key={d.title} className="matrix-card">
              <span className="mono-badge">{d.tag}</span>
              <h3>{d.title}</h3>
              <p className="matrix-sub">{d.subtitle}</p>
              <ul className="matrix-list">
                {d.items.map((item) => (
                  <li key={item}>
                    <span className="matrix-check">✦</span> {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="quote-band">
        <p>“The best ideas often begin as a tiny detail that refuses to leave you alone.”</p>
      </section>
    </main>
  );
}
