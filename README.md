# React x Mermaid

A small, lightweight React wrapper component and hook for rendering Mermaid diagrams from Mermaid syntax strings.

This package exposes a React component and a hook so you can render and control Mermaid diagrams in React apps with minimal setup.

## Features

- Simple `Mermaid` React component that accepts a Mermaid diagram string.
- `useMermaid` hook for programmatic control and rendering.
- Supports server-friendly build output (CJS + ESM + types).

## Installation

Install from npm. Prefer Mermaid **11.x** unless you are on Node.js ≥ 22.12
(Mermaid 12+ requires that engine):

```bash
npm install react-x-mermaid mermaid@^11.9.0
# or
yarn add react-x-mermaid mermaid@^11.9.0
```

> **Note:** `npm install mermaid` without a range may resolve to Mermaid 12,
> which needs Node.js ≥ 22.12. On Node 18/20, pin `mermaid@^11.9.0`.

## Peer dependencies:

<br/>
<img src="https://img.shields.io/badge/React->=18.0.0-blue">
<img src="https://img.shields.io/badge/React Dom->=18.0.0-brightgreen">
<img src="https://img.shields.io/badge/Mermaid->=11.9.0-ff69b4">

Repo / docs: [github.com/navdeepm20/react-x-mermaid](https://github.com/navdeepm20/react-x-mermaid/blob/dev/README.md)

## Migrating to 1.0.0

See [CHANGELOG.md](./CHANGELOG.md) for the full list. Highlights:

- React **18+** required
- Install Mermaid explicitly; prefer `mermaid@^11.9.0` on Node 18/20
- Hook no longer defaults to `securityLevel: "loose"` — opt in if needed
- CJS build is `dist/index.cjs` (package `exports` handles resolution)

## Quick Start

Render a diagram using the `Mermaid` component:

```tsx
import "./App.css";
import RenderMermaid from "react-x-mermaid";

function App() {
  const d1 = `
  graph TD;
  A-->B;
  A-->C;
  B-->D;
  C-->D;
`;

  return (
    <div className="app">
      <RenderMermaid mermaidCode={d1} mermaidConfig={{ theme: "dark" }} />
    </div>
  );
}

export default App;
```

Or use the `useMermaid` hook for manual rendering and lifecycle control:

```tsx
import { useMermaid } from "react-x-mermaid";

function AdvanceMermaidRenderer({ chart }: { chart: string }) {
  // hook also gives you svg along with ref and error which it generate which you can use to download and save locally if required
  const { ref, error } = useMermaid(chart, {
    theme: "dark", // mermaid config
  });

  if (error) {
    // show error or render code in <pre> and <code> tags if you need as a fallback.
    return <div className="mermaid__error">{error}</div>;
  }

  return <div className="mermaid-renderer" ref={ref} />;
}

export default AdvanceMermaidRenderer;
```

```tsx
// App.tsx;

import "./App.css";
import AdvanceMermaidRenderer from "./AdvanceMermaidRenderer";

function App() {
  const d1 = `
  graph TD;
  A-->B;
  A-->C;
  B-->D;
  C-->D;
`;

  return (
    <div className="app">
      <AdvanceMermaidRenderer chart={d1} />
    </div>
  );
}

export default App;
```

## API

### `useMermaid` Hook

A React hook that provides programmatic control over Mermaid diagram rendering with error handling and lifecycle management.

#### Signature

```typescript
useMermaid(chart: string, config?: MermaidConfig) => {
  ref: RefObject<HTMLDivElement | null>;
  svg: string;
  error: string | null;
}
```

#### Parameters

| Parameter | Type            | Required | Description                                                         |
| --------- | --------------- | -------- | ------------------------------------------------------------------- |
| `chart`   | `string`        | Yes      | The Mermaid diagram syntax string to render                         |
| `config`  | `MermaidConfig` | No       | Optional Mermaid configuration object (defaults to internal config) |

#### Returns

| Property | Type                                | Description                                                                           |
| -------- | ----------------------------------- | ------------------------------------------------------------------------------------- |
| `ref`    | `RefObject<HTMLDivElement \| null>` | React ref to attach to a DOM element where the diagram will be rendered               |
| `svg`    | `string`                            | The rendered SVG string of the diagram (useful for downloading or further processing) |
| `error`  | `string \| null`                    | Error message if diagram rendering fails, `null` if successful                        |

### Usage Examples

**Basic Usage:**

```tsx
import { useMermaid } from "react-x-mermaid";

function MyDiagram() {
  const chart = `
    graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
  `;

  const { ref, svg, error } = useMermaid(chart);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <div ref={ref} />;
}
```

**With Custom Configuration:**

```tsx
import { useMermaid } from "react-x-mermaid";

function ThemedDiagram() {
  const chart = "graph TD; A-->B;";

  const { ref, error } = useMermaid(chart, {
    theme: "dark",
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
    },
  });

  return <div ref={ref} />;
}
```

**Using SVG for Download:**

```tsx
import { useMermaid } from "react-x-mermaid";

function DownloadableDiagram() {
  const chart = "graph TD; A-->B;";
  const { ref, svg, error } = useMermaid(chart);

  const downloadSVG = () => {
    if (svg) {
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "diagram.svg";
      a.click();
    }
  };

  return (
    <div>
      <div ref={ref} />
      {svg && <button onClick={downloadSVG}>Download SVG</button>}
    </div>
  );
}
```

#### Behavior

- **Automatic Re-rendering**: The diagram automatically re-renders when the `chart` or `config` parameters change
- **Error Handling**: Catches and exposes rendering errors through the `error` property
- **DOM Integration**: Automatically injects the rendered SVG into the DOM element referenced by `ref`
- **Async Rendering**: Uses Mermaid's async rendering API for better performance

#### Error Handling

The hook gracefully handles various error scenarios:

- Invalid Mermaid syntax
- Configuration errors
- Rendering failures

When an error occurs, the `error` property contains the error message, and the `svg` property is cleared.

### `Mermaid` Component

A React component that renders Mermaid diagrams with built-in error handling, copy functionality, and SVG download capabilities.

#### Signature

```typescript
interface RenderMermaidProps {
  mermaidCode: string;
  errorComponent?: React.ComponentType<{ error: string; mermaidCode: string }>;
  disableDownload?: boolean;
  disableCopy?: boolean;
  downloadComponent?: React.ComponentType<{ onClick: () => void }>;
  copyComponent?: React.ComponentType<{ onClick: () => void }>;
  mermaidConfig?: MermaidConfig;
  renderCode?: React.ComponentType<{ code: string }>;
}

const Mermaid: React.FC<RenderMermaidProps> = (props) => JSX.Element;
```

#### Props

| Prop                | Type                                                          | Required | Default | Description                                                               |
| ------------------- | ------------------------------------------------------------- | -------- | ------- | ------------------------------------------------------------------------- |
| `mermaidCode`       | `string`                                                      | Yes      | -       | The Mermaid diagram syntax string to render                               |
| `errorComponent`    | `React.ComponentType<{ error: string; mermaidCode: string }>` | No       | -       | Custom component to render when diagram fails to load                     |
| `disableDownload`   | `boolean`                                                     | No       | `false` | When `true`, hides the download SVG button                                |
| `disableCopy`       | `boolean`                                                     | No       | `false` | When `true`, hides the copy code button                                   |
| `downloadComponent` | `React.ComponentType<{ onClick: () => void }>`                | No       | -       | Custom component for the download button (replaces default button)        |
| `copyComponent`     | `React.ComponentType<{ onClick: () => void }>`                | No       | -       | Custom component for the copy button (replaces default button)            |
| `mermaidConfig`     | `MermaidConfig`                                               | No       | -       | Mermaid configuration object passed to `mermaid.initialize()`             |
| `renderCode`        | `React.ComponentType<{ code: string }>`                       | No       | -       | Custom component for rendering the raw Mermaid code (used in error state) |

#### Features

- **Automatic Rendering**: Renders Mermaid diagrams from syntax strings
- **Error Handling**: Gracefully handles rendering errors with fallback UI
- **Copy Functionality**: Built-in copy-to-clipboard for the Mermaid code
- **SVG Download**: Download rendered diagrams as SVG files
- **Customizable UI**: Replace default buttons and error components with custom ones
- **Memory Management**: Properly cleans up resources on unmount
- **Memoized**: Uses `React.memo` for performance optimization

#### Usage Examples

**Basic Usage:**

```tsx
import Mermaid from "react-x-mermaid";

function App() {
  const diagram = `
    graph TD;
    A[Start] --> B{Decision};
    B -->|Yes| C[Action 1];
    B -->|No| D[Action 2];
    C --> E[End];
    D --> E;
  `;

  return <Mermaid mermaidCode={diagram} />;
}
```

**With Custom Configuration:**

```tsx
import Mermaid from "react-x-mermaid";

function ThemedDiagram() {
  const diagram = "graph TD; A-->B;";

  return (
    <Mermaid
      mermaidCode={diagram}
      mermaidConfig={{
        theme: "dark",
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
        },
      }}
    />
  );
}
```

**With Disabled Actions:**

```tsx
import Mermaid from "react-x-mermaid";

function SimpleDiagram() {
  const diagram = "graph TD; A-->B;";

  return (
    <Mermaid mermaidCode={diagram} disableDownload={true} disableCopy={true} />
  );
}
```

**With Custom Error Component:**

```tsx
import Mermaid from "react-x-mermaid";

function CustomErrorComponent({ error, mermaidCode }) {
  return (
    <div style={{ padding: "20px", border: "1px solid red" }}>
      <h3>Diagram Error</h3>
      <p>{error}</p>
      <details>
        <summary>View Code</summary>
        <pre>{mermaidCode}</pre>
      </details>
    </div>
  );
}

function DiagramWithCustomError() {
  const diagram = "invalid mermaid syntax";

  return (
    <Mermaid mermaidCode={diagram} errorComponent={CustomErrorComponent} />
  );
}
```

**With Custom Action Buttons:**

```tsx
import Mermaid from "react-x-mermaid";

function CustomCopyButton({ onClick }) {
  return (
    <button onClick={onClick} style={{ background: "blue", color: "white" }}>
      📋 Copy Code
    </button>
  );
}

function CustomDownloadButton({ onClick }) {
  return (
    <button onClick={onClick} style={{ background: "green", color: "white" }}>
      💾 Download
    </button>
  );
}

function DiagramWithCustomButtons() {
  const diagram = "graph TD; A-->B;";

  return (
    <Mermaid
      mermaidCode={diagram}
      copyComponent={CustomCopyButton}
      downloadComponent={CustomDownloadButton}
    />
  );
}
```

**With Custom Code Renderer:**

```tsx
import Mermaid from "react-x-mermaid";

function SyntaxHighlightedCode({ code }) {
  return (
    <div style={{ background: "#f5f5f5", padding: "10px" }}>
      <h4>Mermaid Code:</h4>
      <pre style={{ fontSize: "12px" }}>{code}</pre>
    </div>
  );
}

function DiagramWithCustomCodeRenderer() {
  const diagram = "graph TD; A-->B;";

  return <Mermaid mermaidCode={diagram} renderCode={SyntaxHighlightedCode} />;
}
```

#### CSS Classes

The component applies the following CSS classes that you can style:

- `.mermaid-renderer` - Main container
- `.mermaid-actions` - Container for action buttons
- `.mermaid-action-button` - Default action buttons
- `.btn-copy` - Copy button
- `.btn-download` - Download button
- `.mermaid-diagram` - Container for the rendered diagram
- `.mermaid-error-container` - Error state container
- `.mermaid-code-renderer` - Default code renderer

#### Behavior

- **Automatic Re-rendering**: Re-renders when `mermaidCode` or `mermaidConfig` changes
- **Error Recovery**: Shows error UI with code fallback when rendering fails
- **Memory Management**: Cleans up SVG content on unmount to prevent memory leaks
- **Clipboard Integration**: Uses `navigator.clipboard.writeText()` for copy functionality
- **File Download**: Generates and downloads SVG files with proper MIME type

## Contributing

Contributions are welcome. Please open issues or PRs for bugs and improvements. Keep changes small and add tests for new behavior.

## License

MIT

Keywords
react react-x-mermaid react-mermaid mermaidjs
