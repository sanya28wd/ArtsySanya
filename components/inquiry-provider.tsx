"use client";

import { createContext, useContext, useEffect, useReducer, useState, type ReactNode } from "react";
import type { Format } from "@/lib/artworks";

export type BagItem = { readonly artworkId: string; readonly title: string; readonly slug: string; readonly format: Format };
type State = { readonly items: readonly BagItem[]; readonly open: boolean };
type Action = { readonly type: "add"; readonly item: BagItem } | { readonly type: "remove"; readonly artworkId: string; readonly format: Format } | { readonly type: "toggle" } | { readonly type: "close" } | { readonly type: "hydrate"; readonly items: readonly BagItem[] };
type InquiryContextValue = State & { readonly add: (item: BagItem) => void; readonly remove: (artworkId: string, format: Format) => void; readonly close: () => void; readonly toggle: () => void };

const initialState: State = { items: [], open: false };
const InquiryContext = createContext<InquiryContextValue | null>(null);

const isFormat = (value: unknown): value is Format => value === "original" || value === "print" || value === "commission";

const isBagItem = (value: unknown): value is BagItem => {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return typeof item.artworkId === "string" && typeof item.title === "string" && typeof item.slug === "string" && isFormat(item.format);
};

const readStoredItems = (saved: string): readonly BagItem[] => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(saved);
  } catch (error: unknown) {
    if (error instanceof SyntaxError) return [];
    throw error;
  }

  if (!Array.isArray(parsed)) return [];
  return parsed.filter(isBagItem);
};

const reducer = (state: State, action: Action): State => {
  if (action.type === "hydrate") return { ...state, items: action.items };
  if (action.type === "toggle") return { ...state, open: !state.open };
  if (action.type === "close") return { ...state, open: false };
  if (action.type === "remove") return { ...state, items: state.items.filter((item) => item.artworkId !== action.artworkId || item.format !== action.format) };
  const exists = state.items.some((item) => item.artworkId === action.item.artworkId && item.format === action.item.format);
  return exists ? { ...state, open: true } : { items: [...state.items, action.item], open: true };
};

export const InquiryProvider = ({ children }: { readonly children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("artsy-sanya-inquiry-bag");
    if (saved !== null) dispatch({ type: "hydrate", items: readStoredItems(saved) });
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    window.localStorage.setItem("artsy-sanya-inquiry-bag", JSON.stringify(state.items));
  }, [hasHydrated, state.items]);

  const value: InquiryContextValue = { ...state, add: (item) => dispatch({ type: "add", item }), remove: (artworkId, format) => dispatch({ type: "remove", artworkId, format }), close: () => dispatch({ type: "close" }), toggle: () => dispatch({ type: "toggle" }) };
  return <InquiryContext.Provider value={value}>{children}</InquiryContext.Provider>;
};

export const useInquiry = (): InquiryContextValue => {
  const context = useContext(InquiryContext);
  if (context === null) throw new Error("useInquiry must be used inside InquiryProvider");
  return context;
};
