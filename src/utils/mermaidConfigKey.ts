import { type MermaidConfig } from "mermaid";

/**
 * Stable string key for MermaidConfig so effect deps ignore object identity
 * (inline `{ theme: "dark" }` recreating each render).
 */
export function mermaidConfigKey(config?: MermaidConfig): string {
  return JSON.stringify(config ?? {});
}

export function parseMermaidConfigKey(key: string): MermaidConfig {
  if (!key || key === "{}") return {};
  try {
    return JSON.parse(key) as MermaidConfig;
  } catch {
    return {};
  }
}
