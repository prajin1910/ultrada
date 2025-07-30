import React, { useState, useEffect } from "react";
import { FileUpload } from "../common/FileUpload";
import { MermaidRenderer } from "../common/MermaidRenderer";
import { generateFlowchart, checkServerHealth } from "../../services/api";
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  FileText,
  Download,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

const DocumentAnalysis: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mermaidCode, setMermaidCode] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<
    "checking" | "online" | "offline"
  >("checking");

  useEffect(() => {
    // Check server status on component mount
    checkServerHealth()
      .then(() => {
        setServerStatus("online");
        toast.success("Document analysis server is ready!");
      })
      .catch((err) => {
        console.error("Server health check failed:", err);
        setServerStatus("offline");
        toast.error(
          "Document analysis server is offline. Please start the server."
        );
      });
  }, []);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
    setMermaidCode("");
    setExtractedText("");
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setMermaidCode("");
    setExtractedText("");
    setError(null);
  };

  const handleGenerateFlowchart = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await generateFlowchart(selectedFile);
      setMermaidCode(response.mermaidCode);
      setExtractedText(response.extractedText);

      // Check if it's a fallback flowchart
      if (
        response.mermaidCode.includes("AI Service Quota Exceeded") ||
        response.mermaidCode.includes("Quota Exceeded")
      ) {
        toast("API quota exceeded - showing fallback flowchart", {
          icon: "⚠️",
          style: {
            borderRadius: "10px",
            background: "#fbbf24",
            color: "#1f2937",
          },
        });
      } else {
        toast.success("Flowchart generated successfully!");
      }
    } catch (err) {
      console.error("Flowchart generation error:", err);
      let errorMessage = "An unexpected error occurred";

      if (err instanceof Error) {
        if (err.message.includes("quota") || err.message.includes("429")) {
          errorMessage =
            "API quota exceeded (50 requests/day limit). The flowchart will use a fallback template. Wait 24 hours or upgrade to a paid plan.";
        } else if (
          err.message.includes("overloaded") ||
          err.message.includes("503")
        ) {
          errorMessage =
            "AI service is currently overloaded. Please try again in a few moments.";
        } else if (err.message.includes("Cannot connect")) {
          errorMessage =
            "Cannot connect to document analysis server. Please check if it's running.";
        } else if (err.message.includes("Server error: 404")) {
          errorMessage =
            "Document analysis endpoint not found. Please restart the server.";
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshServer = () => {
    setServerStatus("checking");
    checkServerHealth()
      .then(() => {
        setServerStatus("online");
        toast.success("Server is online!");
      })
      .catch(() => {
        setServerStatus("offline");
        toast.error("Server is still offline");
      });
  };

  const downloadSVG = () => {
    if (!mermaidCode) return;

    const svgElement = document.querySelector("#mermaid-container svg");
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "flowchart.svg";
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Document Analysis & Flowchart Generator
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Upload your documents and automatically generate professional
          flowcharts using AI. Supports PDF, Word documents, and text files.
        </p>
      </div>

      {/* Server Status */}
      <div className="flex items-center justify-center space-x-3">
        {serverStatus === "checking" && (
          <>
            <Loader2 className="h-5 w-5 animate-spin text-yellow-500" />
            <span className="text-yellow-600">Checking server status...</span>
          </>
        )}
        {serverStatus === "online" && (
          <>
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-600">Server is online</span>
          </>
        )}
        {serverStatus === "offline" && (
          <>
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-600">Server is offline</span>
            <button
              onClick={handleRefreshServer}
              className="ml-2 p-1 text-red-500 hover:text-red-700"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* File Upload */}
      <div className="max-w-4xl mx-auto">
        <FileUpload
          onFileSelect={handleFileSelect}
          selectedFile={selectedFile}
          onClearFile={handleClearFile}
          isLoading={isLoading}
        />
      </div>

      {/* Generate Button */}
      {selectedFile && serverStatus === "online" && (
        <div className="text-center">
          <button
            onClick={handleGenerateFlowchart}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-4 rounded-xl font-medium text-lg transition-colors duration-200 flex items-center space-x-3 mx-auto shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Generating Flowchart...</span>
              </>
            ) : (
              <>
                <FileText className="h-6 w-6" />
                <span>Generate Flowchart</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800">Error</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {mermaidCode && (
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Generated Flowchart
            </h2>
            <button
              onClick={downloadSVG}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              <Download className="h-4 w-4" />
              <span>Download SVG</span>
            </button>
          </div>

          <div id="mermaid-container">
            <MermaidRenderer code={mermaidCode} className="shadow-lg" />
          </div>

          {extractedText && (
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Extracted Text Preview
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {extractedText}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      {!selectedFile && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-blue-50 rounded-xl p-8">
            <h3 className="text-xl font-medium text-blue-900 mb-4">
              How it works
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-lg">1</span>
                </div>
                <p className="text-blue-800 font-medium mb-1">
                  Upload Document
                </p>
                <p className="text-blue-600 text-sm">
                  Upload your PDF, Word doc, or text file
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-lg">2</span>
                </div>
                <p className="text-blue-800 font-medium mb-1">AI Analysis</p>
                <p className="text-blue-600 text-sm">
                  Our AI extracts and analyzes the content
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-lg">3</span>
                </div>
                <p className="text-blue-800 font-medium mb-1">Get Flowchart</p>
                <p className="text-blue-600 text-sm">
                  Download your professional flowchart
                </p>
              </div>
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="bg-orange-50 rounded-xl p-8">
            <h3 className="text-xl font-medium text-orange-900 mb-4">
              ⚙️ API Quota Information
            </h3>
            <div className="text-orange-800 space-y-3">
              <p className="font-medium">Current API Status:</p>
              <div className="bg-orange-100 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Free Tier Limit:</strong> 50 requests per day per
                  model
                </p>
                <p className="text-sm mt-1">
                  <strong>Status:</strong>{" "}
                  {serverStatus === "online"
                    ? "✅ Server Online"
                    : "❌ Server Offline"}
                </p>
                <p className="text-sm mt-1">
                  <strong>Fallback Mode:</strong> When quota is exceeded, the
                  system generates template-based flowcharts
                </p>
              </div>
              <p className="text-sm mt-3">
                <strong>If you see quota errors:</strong>
              </p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Wait 24 hours for quota reset (free tier limitation)</li>
                <li>
                  The system will still generate useful flowcharts using
                  templates
                </li>
                <li>Consider upgrading to paid API plan for unlimited usage</li>
              </ul>
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="bg-gray-50 rounded-xl p-8">
            <h3 className="text-xl font-medium text-gray-900 mb-4">
              🔧 Additional Setup
            </h3>
            <div className="text-orange-800 space-y-3">
              <p className="font-medium">
                To use the Document Analysis feature:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  Get a Google Gemini API key from{" "}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Google AI Studio
                  </a>
                </li>
                <li>
                  Open the{" "}
                  <code className="bg-orange-100 px-2 py-1 rounded">.env</code>{" "}
                  file in the project root
                </li>
                <li>
                  Replace{" "}
                  <code className="bg-orange-100 px-2 py-1 rounded">
                    AIzaSyDemoKeyPleaseReplaceWithYourActualKey
                  </code>{" "}
                  with your actual API key
                </li>
                <li>
                  Restart the document analysis server by running{" "}
                  <code className="bg-orange-100 px-2 py-1 rounded">
                    node server/index.js
                  </code>
                </li>
              </ol>
              <p className="text-sm mt-3">
                <strong>Note:</strong> The server needs to be running on port
                3001 for the document analysis to work.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentAnalysis;
