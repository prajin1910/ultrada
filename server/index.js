import express from "express";
import cors from "cors";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
      "http://localhost:5177",
      "http://localhost:5178",
      "http://localhost:5179",
      "http://localhost:5180",
      "http://localhost:5181",
      "http://localhost:5182",
      "http://localhost:5183",
      "http://localhost:5184",
      "http://localhost:5185",
    ],
    credentials: true,
  })
);

app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".txt", ".pdf", ".docx"];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error("Only .txt, .pdf, and .docx files are allowed"), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Extract text from different file types
async function extractTextFromFile(filePath, fileType) {
  try {
    switch (fileType) {
      case ".txt":
        return fs.readFileSync(filePath, "utf8");

      case ".pdf":
        const pdfBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(pdfBuffer);
        return pdfData.text;

      case ".docx":
        const docxBuffer = fs.readFileSync(filePath);
        const result = await mammoth.extractRawText({ buffer: docxBuffer });
        return result.value;

      default:
        throw new Error("Unsupported file type");
    }
  } catch (error) {
    console.error("Error extracting text:", error);
    throw new Error("Failed to extract text from file");
  }
}

// Generate flowchart using Gemini API
async function generateFlowchart(extractedText) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Truncate text if it's too long (max 8000 characters for better results)
    let processedText = extractedText;
    if (extractedText.length > 8000) {
      console.log(
        `Text too long (${extractedText.length} chars), truncating to 8000 chars`
      );
      processedText = extractedText.substring(0, 8000) + "...";
    }

    const prompt = `You are an expert AI assistant specialized in creating professional, user-friendly Mermaid.js flowcharts. Convert the following content into a clear, accurate, and visually appealing flowchart.

ADVANCED RULES FOR BETTER READABILITY:
1. Always start with "graph TD" (top-down layout)
2. Use descriptive, meaningful node IDs (START, PROCESS1, DECISION1, etc.)
3. Choose appropriate node shapes for clarity:
   - Rectangle A[Process Step] for actions/processes
   - Diamond A{Decision Question?} for yes/no decisions  
   - Rounded A(Input/Output) for inputs/outputs
   - Circle A((Start/End)) for start/end points
4. Use clear, descriptive labels (max 3-4 words per node)
5. Add decision labels: A -->|Yes| B and A -->|No| C
6. Group related processes logically
7. Ensure proper flow from start to end
8. Use consistent naming and spacing
9. Add meaningful edge labels for complex flows
10. Structure should be logical and easy to follow

CONTENT TO ANALYZE AND CONVERT:
"""
${processedText}
"""

Create a professional flowchart that:
- Captures all key steps and decisions from the content
- Uses clear, business-friendly language
- Has proper logical flow
- Is visually balanced and easy to read
- Includes all important decision points
- Has clear start and end points

Example of well-structured format:
graph TD
    START((Start Process)) --> INPUT[Collect User Input]
    INPUT --> VALIDATE{Is Input Valid?}
    VALIDATE -->|Yes| PROCESS[Process Request]
    VALIDATE -->|No| ERROR[Show Error Message]
    ERROR --> INPUT
    PROCESS --> SUCCESS[Display Success]
    SUCCESS --> END((Complete))

Generate only the mermaid code, no explanations.`;

    // Retry logic for API overload
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        attempts++;
        console.log(`Attempt ${attempts} to generate flowchart...`);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } catch (apiError) {
        console.log(`Attempt ${attempts} failed:`, apiError.message);

        if (apiError.message.includes("overloaded") && attempts < maxAttempts) {
          const delay = Math.pow(2, attempts) * 1000; // Exponential backoff
          console.log(`Waiting ${delay}ms before retry...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        throw apiError;
      }
    }
  } catch (error) {
    console.error("Error generating flowchart:", error);

    // Return a fallback flowchart if AI fails
    if (
      error.message.includes("overloaded") ||
      error.message.includes("quota") ||
      error.message.includes("429")
    ) {
      console.log("Returning fallback flowchart due to API quota/overload");

      // Create a simple generic flowchart based on document type and content
      return generateFallbackFlowchart(extractedText);
    }

    throw new Error("Failed to generate flowchart");
  }
}

// Generate a basic flowchart when AI service is unavailable
function generateFallbackFlowchart(text) {
  const lowerText = text.toLowerCase();

  // Detect document type and create appropriate flowchart
  if (
    lowerText.includes("registration") ||
    lowerText.includes("sign up") ||
    lowerText.includes("account")
  ) {
    return `graph TD
    START((Start Registration)) --> INPUT[User Enters Information]
    INPUT --> VALIDATE{Validate Input}
    VALIDATE -->|Valid| CREATE[Create Account]
    VALIDATE -->|Invalid| ERROR[Show Error]
    ERROR --> INPUT
    CREATE --> CONFIRM[Send Confirmation]
    CONFIRM --> SUCCESS[Registration Complete]
    SUCCESS --> END((End))`;
  }

  if (
    lowerText.includes("login") ||
    lowerText.includes("authentication") ||
    lowerText.includes("sign in")
  ) {
    return `graph TD
    START((Start Login)) --> ENTER[Enter Credentials]
    ENTER --> CHECK{Verify Credentials}
    CHECK -->|Valid| SUCCESS[Login Successful]
    CHECK -->|Invalid| ERROR[Login Failed]
    ERROR --> ENTER
    SUCCESS --> DASHBOARD[Redirect to Dashboard]
    DASHBOARD --> END((End))`;
  }

  if (
    lowerText.includes("order") ||
    lowerText.includes("purchase") ||
    lowerText.includes("payment")
  ) {
    return `graph TD
    START((Start Order)) --> SELECT[Select Products]
    SELECT --> CART[Add to Cart]
    CART --> CHECKOUT[Proceed to Checkout]
    CHECKOUT --> PAYMENT[Process Payment]
    PAYMENT --> CONFIRM[Order Confirmation]
    CONFIRM --> SHIP[Ship Products]
    SHIP --> END((Order Complete))`;
  }

  if (
    lowerText.includes("process") ||
    lowerText.includes("workflow") ||
    lowerText.includes("procedure")
  ) {
    return `graph TD
    START((Start Process)) --> STEP1[Initial Step]
    STEP1 --> STEP2[Process Data]
    STEP2 --> DECISION{Decision Point}
    DECISION -->|Yes| STEP3[Continue Process]
    DECISION -->|No| STEP4[Alternative Path]
    STEP3 --> END1((Complete))
    STEP4 --> END2((Alternative End))`;
  }

  // Generic fallback for any document
  return `graph TD
    START((Document Analysis)) --> EXTRACT[Text Extracted: ${
      Math.round(text.length / 100) * 100
    } characters]
    EXTRACT --> CONTENT[Content Processed]
    CONTENT --> NOTE[AI Service Quota Exceeded]
    NOTE --> INFO[Free Tier: 50 requests/day limit reached]
    INFO --> SOLUTION[Solutions Available]
    SOLUTION --> OPTION1[Wait 24 hours for quota reset]
    SOLUTION --> OPTION2[Upgrade to paid API plan]
    OPTION1 --> END1((Try Again Tomorrow))
    OPTION2 --> END2((Upgrade Account))`;
}

// POST endpoint for file upload and flowchart generation
app.post("/api/generate-flowchart", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();

    console.log(`Processing file: ${req.file.originalname}`);

    // Extract text from the uploaded file
    const extractedText = await extractTextFromFile(filePath, fileExt);

    if (!extractedText || extractedText.trim().length === 0) {
      return res
        .status(400)
        .json({ error: "No text content found in the file" });
    }

    console.log(`Extracted text length: ${extractedText.length} characters`);

    // Generate flowchart using Gemini API
    const rawMermaidCode = await generateFlowchart(extractedText);

    // Clean the Mermaid code - remove markdown formatting
    let mermaidCode = rawMermaidCode.trim();

    // Remove markdown code block formatting if present
    mermaidCode = mermaidCode.replace(/```mermaid\n?/g, "");
    mermaidCode = mermaidCode.replace(/```\n?/g, "");
    mermaidCode = mermaidCode.trim();

    // Additional cleaning for common issues
    // Fix problematic characters in node labels
    mermaidCode = mermaidCode.replace(/\[([^\]]*)\(/g, (match, p1) => {
      // Replace parentheses in node labels with spaces
      return "[" + p1.replace(/[()]/g, " ");
    });

    // Remove any remaining problematic characters from node labels
    mermaidCode = mermaidCode.replace(/\[([^\]]*)\]/g, (match, p1) => {
      // Clean the text inside brackets
      const cleanText = p1
        .replace(/[{}()\[\]]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      return "[" + cleanText + "]";
    });

    // Ensure it starts with graph TD
    if (
      !mermaidCode.startsWith("graph TD") &&
      !mermaidCode.startsWith("graph LR")
    ) {
      // Try to find where the actual graph starts
      const lines = mermaidCode.split("\n");
      const graphStartIndex = lines.findIndex((line) =>
        line.trim().startsWith("graph")
      );
      if (graphStartIndex > 0) {
        mermaidCode = lines.slice(graphStartIndex).join("\n");
      } else {
        // If no graph declaration found, add it
        mermaidCode = "graph TD\n" + mermaidCode;
      }
    }

    console.log("Generated Mermaid code:", mermaidCode);

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      mermaidCode: mermaidCode,
      extractedText: extractedText.substring(0, 500) + "...", // Preview of extracted text
    });
  } catch (error) {
    console.error("Server error:", error);

    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(
    "Gemini API configured:",
    process.env.GEMINI_API_KEY ? "Yes" : "No"
  );
});
