import { useEffect, useRef, useState } from "react";
import mermaid, { type MermaidConfig } from "mermaid";

const useMermaid = (chart: string, config: MermaidConfig = {}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

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

        mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          suppressErrorRendering: true,
          ...config,
        });

        const { svg } = await mermaid.render(`mermaid-${Date.now()}`, chart);
        if (cancelled) return;
        setSvg(svg);
        setError(null);
        if (ref.current) {
          ref.current.innerHTML = svg;
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
  }, [chart, config]);

  return { ref, svg, error };
};

export const defaultMermaidConfig: MermaidConfig = {
  /* ... */
};
export default useMermaid;
