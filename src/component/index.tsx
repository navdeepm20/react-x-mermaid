import React, { useState, useRef, useEffect, useId, memo } from "react";
import { type MermaidConfig } from "mermaid";
// styles
import "./styles.css";
import { renderMermaidDiagram } from "../utils/renderMermaid";
import {
  mermaidConfigKey,
  parseMermaidConfigKey,
} from "../utils/mermaidConfigKey";

// Simple SVG icons to replace MUI icons
const CopyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
  </svg>
);
const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
  </svg>
);

// Download SVG function
const handleDownloadSvg = (
  mermaidRef: React.RefObject<HTMLDivElement | null>
) => {
  if (mermaidRef.current) {
    const svgElement = mermaidRef.current.querySelector("svg");
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download = "mermaid-diagram.svg";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
    }
  }
};

// Simple component based approach for rendering
export interface RenderMermaidProps {
  mermaidCode: string;
  errorComponent?: React.ComponentType<{ error: string; mermaidCode: string }>;
  disableDownload?: boolean;
  disableCopy?: boolean;
  downloadComponent?: React.ComponentType<{ onClick: () => void }>;
  copyComponent?: React.ComponentType<{ onClick: () => void }>;
  mermaidConfig?: MermaidConfig;
  renderCode?: React.ComponentType<{ code: string }>;
}

const CodeRenderer: React.FC<{ children: string }> = ({ children }) => (
  <pre className="mermaid-code-renderer">
    <code>{children}</code>
  </pre>
);

function RenderMermaid({
  mermaidCode,
  errorComponent: ErrorComponent,
  disableDownload = false,
  disableCopy = false,
  downloadComponent: DownloadComponent,
  copyComponent: CopyComponent,
  mermaidConfig,
  renderCode: RenderCode,
}: RenderMermaidProps) {
  const [error, setError] = useState<string | null>(null);
  const id = useId();
  const mermaidRef = useRef<HTMLDivElement | null>(null);
  const configKey = mermaidConfigKey(mermaidConfig);
  const handleCopyCode = () => {
    navigator.clipboard.writeText(mermaidCode ?? "");
  };

  useEffect(() => {
    const currentRef = mermaidRef.current;
    // Ignore stale async results after deps change or unmount
    let cancelled = false;
    const resolvedConfig = parseMermaidConfigKey(configKey);
    const renderDiagram = async () => {
      // Guard against empty or whitespace-only code
      if (!mermaidCode?.trim()) {
        if (!cancelled && mermaidRef.current) {
          mermaidRef.current.innerHTML = "";
        }
        return;
      }
      if (!cancelled) {
        setError(null);
      }
      try {
        // Serialized initialize+render so multi-instance themes do not race
        const svg = await renderMermaidDiagram(
          `mermaid-${id.replace(/:/g, "")}`,
          mermaidCode,
          resolvedConfig
        );

        // Only update the DOM if this effect is still current
        if (!cancelled && mermaidRef.current) {
          mermaidRef.current.innerHTML = svg;
        }
      } catch (err) {
        if (!cancelled) {
          setError((err as Error).message);
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = "";
          }
        }
      }
    };

    renderDiagram();
    return () => {
      cancelled = true;
      if (currentRef) {
        currentRef.innerHTML = ""; // Clear the SVG on unmount / before re-run
      }
    };
  }, [mermaidCode, id, configKey]);

  if (error) {
    // Use custom error component if provided
    if (ErrorComponent) {
      return <ErrorComponent error={error} mermaidCode={mermaidCode} />;
    }
    // Default error rendering
    return (
      <div className="mermaid-error-container">
        <div className="mermaid-actions">
          {!disableCopy &&
            (CopyComponent ? (
              <CopyComponent onClick={handleCopyCode} />
            ) : (
              <button
                onClick={handleCopyCode}
                className="mermaid-action-button btn-copy"
              >
                <CopyIcon />
              </button>
            ))}
        </div>
        {RenderCode ? (
          <RenderCode code={mermaidCode} />
        ) : (
          <CodeRenderer>{mermaidCode}</CodeRenderer>
        )}
      </div>
    );
  }

  return (
    <div className="mermaid-renderer" key={mermaidCode}>
      {/* copy code and download buttons */}
      <div className="mermaid-actions">
        {!disableCopy &&
          (CopyComponent ? (
            <CopyComponent onClick={handleCopyCode} />
          ) : (
            <button
              onClick={handleCopyCode}
              className="mermaid-action-button btn-copy"
            >
              <CopyIcon />
            </button>
          ))}
        {!disableDownload &&
          (DownloadComponent ? (
            <DownloadComponent onClick={() => handleDownloadSvg(mermaidRef)} />
          ) : (
            <button
              onClick={() => handleDownloadSvg(mermaidRef)}
              className="mermaid-action-button btn-download"
            >
              <DownloadIcon />
            </button>
          ))}
      </div>
      <div ref={mermaidRef} className="mermaid-diagram" />
    </div>
  );
}

/**
 * RenderMermaid (exported)
 * @param {object} props - Component props
 * @param {string} props.mermaidCode - Mermaid diagram source string.
 * @param {React.ComponentType<{error:string; mermaidCode:string}>} [props.errorComponent] - Optional custom error UI.
 * @param {boolean} [props.disableDownload] - When true, hides the download action.
 * @param {boolean} [props.disableCopy] - When true, hides the copy action.
 * @param {React.ComponentType<{onClick: ()=>void}>} [props.downloadComponent] - Optional custom download button component.
 * @param {React.ComponentType<{onClick: ()=>void}>} [props.copyComponent] - Optional custom copy button component.
 * @param {MermaidConfig} [props.mermaidConfig] - Partial mermaid config passed to mermaid.initialize.
 * @param {React.ComponentType<{code:string}>} [props.renderCode] - Optional renderer for displaying the raw code.
 * @return {JSX.Element} The rendered Mermaid diagram or error component.
 */
const RenderMermaidExport = memo(
  RenderMermaid
) as unknown as React.FC<RenderMermaidProps>;

export default RenderMermaidExport;
