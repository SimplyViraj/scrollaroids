import type { CSSProperties } from "react";
import type { Title } from "@/data/titles";

const toStyle = (background: string): CSSProperties => ({
  background,
  backgroundSize: "cover",
  backgroundPosition: "center",
});

export const posterStyle = (title: Title): CSSProperties => toStyle(title.poster);

export const backdropStyle = (title: Title): CSSProperties => toStyle(title.backdrop);