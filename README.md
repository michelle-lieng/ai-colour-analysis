# Color Analysis App

## Overview
The Color Analysis App is a simple web application that allows users to take a picture and analyze the colors of their eyes, hair, and skin. The app extracts the color hex codes from the image and provides a detailed color analysis using a language model.

## Features
- Capture images using the device's camera.
- Extract color hex codes for eyes, hair, and skin.
- Send extracted colors to a language model for analysis.
- Display the color analysis results in a user-friendly format.

## Project Structure
```
color-analysis-app
├── src
│   ├── components
│   │   ├── Camera.tsx
│   │   ├── ColorExtractor.ts
│   │   └── AnalysisResult.tsx
│   ├── services
│   │   ├── api.ts
│   │   └── colorAnalysis.ts
│   ├── App.tsx
│   └── index.tsx
├── public
│   └── index.html
├── package.json
├── tsconfig.json
└── README.md
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd color-analysis-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
1. Start the development server:
   ```
   npm start
   ```
2. Open your browser and go to `http://localhost:3000`.
3. Use the camera component to take a picture.
4. The app will automatically extract the colors and display the analysis results.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License.