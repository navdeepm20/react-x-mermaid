import mermaid, { type MermaidConfig } from "mermaid";

const DEFAULT_CONFIG: MermaidConfig = {
  startOnLoad: false,
  theme: "default",
  suppressErrorRendering: true,
};

/**
 * Mermaid's initialize() is process-global. Concurrent callers with different
 * configs race and bleed themes. Serialize initialize+render so each diagram
 * gets the config it asked for.
 */
let renderQueue: Promise<unknown> = Promise.resolve();

export function renderMermaidDiagram(
  id: string,
  chart: string,
  config: MermaidConfig = {}
): Promise<string> {
  const run = async () => {
    mermaid.initialize({
      ...DEFAULT_CONFIG,
      ...config,
    });
    const { svg } = await mermaid.render(id, chart);
    return svg;
  };

  const result = renderQueue.then(run, run);
  renderQueue = result.then(
    () => undefined,
    () => undefined
  );
  return result;
}
