# Changelog

All notable changes to this project are documented in this file.

## [1.0.0] - 2026-10-02

First stable major release. Includes packaging fixes, React 18 peers, and
reliability improvements for concurrent diagrams.

### Breaking changes

- **React / React DOM peers** are now `>=18.0.0` (component uses `useId`).
- **CJS entry** is `dist/index.cjs` (was `dist/index.js`). Prefer the package
  `exports` map; `require("react-x-mermaid")` still works via `exports.require`.
- **`securityLevel: "loose"`** is no longer the hook default. Pass it explicitly
  in config if you need HTML-in-labels:
  `useMermaid(chart, { securityLevel: "loose" })`.
- **`mermaid` is a required peer dependency** (no longer marked optional).

### Added

- Shared serialized `initialize` + `render` queue so multiple instances with
  different themes/configs no longer race.
- Stable config identity for effects (inline `{ theme: "dark" }` no longer
  re-renders every parent update).
- Proper `exports` / `files` packaging for dual CJS + ESM + types.
- CSS module declaration for TypeScript (`*.css` imports).

### Fixed

- Empty / invalid charts leave stale SVG in the hook DOM.
- Stale async renders after fast updates or unmount (`cancelled` guards).
- `prepublishOnly` lifecycle under `scripts`.
- Rollup visualizer no longer opens a browser on every build.
- README renamed to `README.md` for reliable GitHub/npm links.
- Removed `key={mermaidCode}` remounts that fought effect cleanup.

### Docs

- Recommend pinning `mermaid@^11.9.0` on Node < 22.12 (Mermaid 12 needs
  Node ≥ 22.12).

### Migration from 0.x

1. Upgrade React to 18+.
2. Ensure `mermaid` is installed (`mermaid@^11.9.0` recommended).
3. If you relied on loose security in `useMermaid`, pass
   `{ securityLevel: "loose" }` yourself.
4. Reinstall / clear lockfile if tools still resolve the old `dist/index.js`
   path; the package `exports` field handles modern resolvers.
