import { useEffect, useRef, useState } from "react";
import { type MermaidConfig } from "mermaid";
import { renderMermaidDiagram } from "../utils/renderMermaid";
import {
  mermaidConfigKey,
  parseMermaidConfigKey,
} from "../utils/mermaidConfigKey";

const useMermaid = (chart: string, config: MermaidConfig = {}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const configKey = mermaidConfigKey(config);

  useEffect(() => {
    let cancelled = false;
    const resolvedConfig = parseMermaidConfigKey(configKey);

    const renderDiagram = async () => {
      try {
        if (!chart?.trim()) {
          if (cancelled) return;
          setSvg("");
          setError(null);
          if (ref.current) {
            ref.current.innerHTML = "";
          }
          return;
        }

        const rendered = await renderMermaidDiagram(
          `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          chart,
          resolvedConfig
        );
        if (cancelled) return;
        setSvg(rendered);
        setError(null);
        if (ref.current) {
          ref.current.innerHTML = rendered;
        }
      } catch (err: unknown) {
        if (cancelled) return;
        setError((err as Error).message);
        setSvg("");
        if (ref.current) {
          ref.current.innerHTML = "";
        }
      }
    };

    renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [chart, configKey]);

  return { ref, svg, error };
};

export const defaultMermaidConfig: MermaidConfig = {
  /* ... */
};
export default useMermaid;
