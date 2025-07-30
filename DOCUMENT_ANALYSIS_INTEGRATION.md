# Hackathon Project - Document Analysis Integration

This project integrates document analysis and flowchart generation functionality into the main hackathon application.

## Features Added

### Document Analysis Module
- **File Upload**: Upload text documents (.txt format)
- **AI-Powered Analysis**: Uses Google Gemini AI to analyze document content
- **Flowchart Generation**: Automatically generates professional Mermaid.js flowcharts
- **Interactive UI**: Clean, modern interface integrated into the student dashboard
- **Download Functionality**: Export generated flowcharts as SVG files

## Setup Instructions

### 1. Install Dependencies
```bash
cd Hack4.0-main
npm install
```

### 2. Configure API Key
1. Get a Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Open the `.env` file in the project root
3. Replace `AIzaSyDemoKeyPleaseReplaceWithYourActualKey` with your actual API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### 3. Run the Application

#### Option 1: Run Both Servers Manually
```bash
# Terminal 1: Start the main frontend
npm run dev

# Terminal 2: Start the document analysis server
node server/index.js
```

#### Option 2: Run Both Servers with Concurrently
```bash
npm run dev:full
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Document Analysis Server: http://localhost:3001

## How to Use

1. **Login to the Application**: Use the existing login system
2. **Navigate to Student Dashboard**: Go to the student section
3. **Access Document Analysis**: Click on "Document Analysis" in the sidebar
4. **Upload a Document**: 
   - Drag and drop a .txt file or click to browse
   - The file should contain process descriptions or workflows
5. **Generate Flowchart**: Click "Generate Flowchart" button
6. **View Results**: The AI will generate a professional flowchart
7. **Download**: Use the "Download SVG" button to save the flowchart

## Project Structure

```
Hack4.0-main/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── FileUpload.tsx          # File upload component
│   │   │   └── MermaidRenderer.tsx     # Flowchart renderer
│   │   └── student/
│   │       └── DocumentAnalysis.tsx    # Main document analysis page
│   └── services/
│       └── api.ts                      # Updated with document analysis APIs
├── server/
│   └── index.js                        # Document analysis server
├── test-process.txt                    # Sample test file
└── .env                               # Environment configuration
```

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **AI**: Google Gemini API
- **Visualization**: Mermaid.js
- **File Processing**: Multer for file uploads
- **UI Components**: Lucide React icons

## Sample Test File

A sample test file (`test-process.txt`) has been created with a simple user registration process that you can use to test the functionality.

## Troubleshooting

### Server Issues
- Ensure the document analysis server is running on port 3001
- Check that your Gemini API key is valid
- Look for error messages in the browser console

### File Upload Issues
- Currently only .txt files are supported
- File size limit is 10MB
- Ensure the file contains readable text content

### Flowchart Generation Issues
- Check your internet connection (required for AI API calls)
- Verify your API key has proper permissions
- Try with simpler text content if generation fails

## Future Enhancements

- Support for PDF and Word documents
- Batch processing of multiple files
- Custom flowchart styling options
- Export to additional formats (PNG, PDF)
- Integration with the assessment system
- Collaborative editing features

## API Endpoints

- `GET /api/health` - Check server status
- `POST /api/generate-flowchart` - Generate flowchart from uploaded file

## Environment Variables

- `GEMINI_API_KEY` - Your Google Gemini API key
- `PORT` - Server port (default: 3001)
- `VITE_API_URL` - Document analysis server URL for frontend
