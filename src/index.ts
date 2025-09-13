import useMermaid from "./hooks/useMermaid";
import { MermaidConfig } from "mermaid";
// exporting mermaid config for better dev experience and useMermaid hook as named export
export { useMermaid, type MermaidConfig };
// exporting the component as default
export { default } from "./component";
