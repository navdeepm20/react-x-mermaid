# React x Mermaid

A small, lightweight React wrapper component and hook for rendering Mermaid diagrams from Mermaid syntax strings.

This package exposes a React component and a hook so you can render and control Mermaid diagrams in React apps with minimal setup.

## Features

- Simple `Mermaid` React component that accepts a Mermaid diagram string.
- `useMermaid` hook for programmatic control and rendering.
- Supports server-friendly build output (CJS + ESM + types).

## Installation

Install from npm:

```bash
npm install react-mermaid-wrapper
# or
yarn add react-mermaid-wrapper
```

Peer dependencies: React and ReactDOM (>=16.8.0).

## Quick Start

Render a diagram using the `Mermaid` component:

```tsx
import React from "react";
import Mermaid from "react-mermaid-wrapper";

export default function App() {
  const code = `
		graph TD
			A[Start] --> B{Is it OK?}
			B -->|Yes| C[Continue]
			B -->|No| D[Stop]
	`;

  return <Mermaid chart={code} />;
}
```

Or use the `useMermaid` hook for manual rendering and lifecycle control:

```tsx
# example here
```

## API

- `default` / `Mermaid` component
  - Write here

- `useMermaid` hook
  - Write here

Check the `src/component` and `src/hooks` source files for exact prop and return shapes and TypeScript types.

## Building / Publishing

This repo uses Rollup to emit CJS, ESM and .d.ts bundles. Use the `rollup` script in `package.json` to build:

```bash
npm run rollup
```

## Contributing

Contributions are welcome. Please open issues or PRs for bugs and improvements. Keep changes small and add tests for new behavior.

## License

MIT
