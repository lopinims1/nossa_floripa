"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Tema = "floripa" | "noturno" | "oceano" | "urbano";

export const temas: Record<Tema, Record<string, string>> = {
  floripa: {
    "--bg-sidebar": "#d4e8c2",
    "--bg-main": "#FFF5E7",
    "--bg-feed": "#FFF5E7",
    "--bg-right": "#d4e8c2",
    "--bg-card": "#f5ede0",
    "--cor-primaria": "#3C5E45",
    "--cor-secundaria": "#3C5E45",
    "--cor-texto": "#1a2e1e",
    "--cor-texto-suave": "#7a8c7d",
    "--cor-borda": "#C8A97E",
    "--cor-branco": "#FFF5E7",
    "--cor-accent": "#e8f5d8",
  },
  noturno: {
    "--bg-sidebar": "#1a1f1b",
    "--bg-main": "#121712",
    "--bg-feed": "#1a2019",
    "--bg-right": "#1a1f1b",
    "--bg-card": "#222b22",
    "--cor-primaria": "#4e8c5f",
    "--cor-secundaria": "#6db882",
    "--cor-texto": "#e0f0e3",
    "--cor-texto-suave": "#8aab8e",
    "--cor-borda": "#2e4030",
    "--cor-branco": "#1a2019",
    "--cor-accent": "#2e4a30",
  },
  oceano: {
    "--bg-sidebar": "#b8d9e8",
    "--bg-main": "#e8f4f8",
    "--bg-feed": "#f0f8fc",
    "--bg-right": "#b8d9e8",
    "--bg-card": "#c8e3ef",
    "--cor-primaria": "#2a6b8a",
    "--cor-secundaria": "#1a4d6b",
    "--cor-texto": "#0d2b3d",
    "--cor-texto-suave": "#4a7a90",
    "--cor-borda": "#5a9ab5",
    "--cor-branco": "#e8f4f8",
    "--cor-accent": "#d0eef8",
  },
  urbano: {
    "--bg-sidebar": "#2a2a2a",
    "--bg-main": "#1a1a1a",
    "--bg-feed": "#222222",
    "--bg-right": "#2a2a2a",
    "--bg-card": "#333333",
    "--cor-primaria": "#c8a84b",
    "--cor-secundaria": "#e0c060",
    "--cor-texto": "#f0ead8",
    "--cor-texto-suave": "#a09070",
    "--cor-borda": "#444444",
    "--cor-branco": "#1a1a1a",
    "--cor-accent": "#3a3020",
  },
};

const temaValido = (t: string | null): t is Tema =>
  t !== null && t in temas;

const TemaContext = createContext<{
  tema: Tema;
  setTema: (t: Tema) => void;
}>({ tema: "floripa", setTema: () => {} });

export function TemaProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>("floripa");

  useEffect(() => {
    const saved = localStorage.getItem("nf-tema");
    if (temaValido(saved)) setTema(saved);
  }, []);

  useEffect(() => {
    const vars = temas[tema];
    if (!vars) return;
    const root = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
    localStorage.setItem("nf-tema", tema);
  }, [tema]);

  return (
    <TemaContext.Provider value={{ tema, setTema }}>
      {children}
    </TemaContext.Provider>
  );
}

export const useTema = () => useContext(TemaContext);