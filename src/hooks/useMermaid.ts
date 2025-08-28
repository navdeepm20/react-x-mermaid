import { useEffect, useRef, useState } from "react";
import mermaid, { type MermaidConfig } from "mermaid";

const useMermaid = (chart: string, config: MermaidConfig = {}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          securityLevel: "loose",
          suppressErrorRendering: true,
          ...config,
        });

        if (chart) {
          const { svg } = await mermaid.render(`mermaid-${Date.now()}`, chart);
          setSvg(svg);
          setError(null);
          if (ref.current) {
            ref.current.innerHTML = svg;
          }
        }
      } catch (err: unknown) {
        setError((err as Error).message);
        setSvg("");
      }
    };

    renderDiagram();
  }, [chart, config]);

  return { ref, svg, error };
};

export const defaultMermaidConfig: MermaidConfig = {
  /* ... */
};
export default useMermaid;
