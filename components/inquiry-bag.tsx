"use client";

import Link from "next/link";
import { useInquiry } from "@/components/inquiry-provider";
import { site, whatsappLink } from "@/lib/site";

const labels = { original: "Original artwork", print: "Fine-art print", commission: "Similar commission" } as const;

export const InquiryBag = () => {
  const { items, open, close, remove } = useInquiry();
  const message = ["Hello Sanya! I would love to enquire about:", ...items.map((item) => `• ${item.title} — ${labels[item.format]} (${site.url}/artwork/${item.slug})`), "\nI am based in the UAE. Please share availability, price, dimensions, and delivery details.\n\nThank you!"].join("\n");
  return <aside className={`bag-drawer ${open ? "is-open" : ""}`} aria-hidden={!open}><button className="scrim" onClick={close} aria-label="Close inquiry bag"/><section className="bag-panel" aria-label="Inquiry bag"><div className="bag-head"><p className="eyebrow">Your selections</p><button onClick={close} aria-label="Close">×</button></div><h2>Inquiry Bag</h2>{items.length === 0 ? <div className="empty-bag"><p>Your collection is waiting.</p><Link href="/gallery" onClick={close}>Explore the gallery →</Link></div> : <><ul className="bag-list">{items.map((item) => <li key={`${item.artworkId}-${item.format}`}><div><strong>{item.title}</strong><span>{labels[item.format]}</span></div><button onClick={() => remove(item.artworkId, item.format)} aria-label={`Remove ${item.title}`}>Remove</button></li>)}</ul><a className="button button-dark" href={whatsappLink(message)} target="_blank" rel="noreferrer">Send on WhatsApp ↗</a><p className="bag-note">No payment is taken here. Sanya will confirm availability, pricing, and UAE delivery personally.</p></>}</section></aside>;
};
