import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface MermaidRendererProps {
  code: string;
  className?: string;
}

export const MermaidRenderer: React.FC<MermaidRendererProps> = ({
  code,
  className = "",
}) => {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose",
      fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: "linear",
        nodeSpacing: 100,
        rankSpacing: 120,
        padding: 20,
        diagramPadding: 20,
      },
      themeVariables: {
        fontSize: "18px",
        fontWeight: "500",
        primaryColor: "#f0f9ff",
        primaryTextColor: "#1e293b",
        primaryBorderColor: "#3b82f6",
        lineColor: "#475569",
        sectionBkgColor: "#ffffff",
        altSectionBkgColor: "#f8fafc",
        gridColor: "#e2e8f0",
        c0: "#dbeafe",
        c1: "#bfdbfe",
        c2: "#93c5fd",
        c3: "#60a5fa",
        c4: "#3b82f6",
        cScale0: "#f0f9ff",
        cScale1: "#e0f2fe",
        cScale2: "#bae6fd",
      },
      gantt: {
        fontSize: 16,
      },
    });
  }, []);

  useEffect(() => {
    const renderMermaid = async () => {
      if (mermaidRef.current && code) {
        mermaidRef.current.innerHTML = "";

        try {
          console.log("Rendering Mermaid code:", code);
          const id = `mermaid-${Date.now()}`;

          // Clean the code to ensure proper format
          const cleanCode = code.trim();

          // Use the modern async API
          const { svg } = await mermaid.render(id, cleanCode);

          if (mermaidRef.current) {
            // Enhanced SVG with better styling
            const enhancedSvg = svg
              .replace(
                /<svg/,
                '<svg style="max-width: 100%; height: auto; font-family: Inter, system-ui, sans-serif;"'
              )
              .replace(/font-size="[\d.]+px"/g, 'font-size="16px"')
              .replace(/font-weight="[\d]+"/g, 'font-weight="500"');

            mermaidRef.current.innerHTML = enhancedSvg;

            // Add custom CSS for better readability
            const style = document.createElement("style");
            style.textContent = `
              .mermaid .node rect,
              .mermaid .node circle,
              .mermaid .node ellipse,
              .mermaid .node polygon {
                stroke-width: 2px !important;
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
              }
              .mermaid .node .label {
                font-weight: 500 !important;
                font-size: 16px !important;
              }
              .mermaid .edgeLabel {
                background-color: white !important;
                padding: 2px 6px !important;
                border-radius: 4px !important;
                font-weight: 500 !important;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
              }
              .mermaid .edge-pattern-solid {
                stroke-width: 2px !important;
              }
            `;

            if (!document.head.querySelector("#mermaid-custom-style")) {
              style.id = "mermaid-custom-style";
              document.head.appendChild(style);
            }
          }
        } catch (error) {
          console.error("Mermaid rendering error:", error);
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = `
              <div class="text-red-500 p-4 border border-red-200 rounded-lg bg-red-50">
                <p class="font-medium">Failed to render flowchart</p>
                <p class="text-sm mt-1">The content might be too complex or contain unsupported syntax.</p>
                <p class="text-sm mt-1">Error: ${
                  error instanceof Error ? error.message : "Unknown error"
                }</p>
                <details class="mt-2">
                  <summary class="cursor-pointer text-sm">Show Technical Details</summary>
                  <pre class="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">${code}</pre>
                </details>
              </div>
            `;
          }
        }
      }
    };

    renderMermaid();
  }, [code]);

  if (!code) {
    return (
      <div
        className={`flex items-center justify-center h-96 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg ${className}`}
      >
        <p>No flowchart generated yet</p>
      </div>
    );
  }

  return (
    <div className={`border rounded-lg bg-white overflow-auto ${className}`}>
      <div
        ref={mermaidRef}
        className="p-6 min-h-96 flex items-center justify-center"
      />
    </div>
  );
};