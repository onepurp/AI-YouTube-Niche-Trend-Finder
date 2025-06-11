# AI YouTube Niche Trend Finder

## Description

This application uses AI to analyze YouTube trends based on a user-provided niche. It suggests current trends and provides example YouTube videos related to those trends.

## Features

*   Analyzes YouTube niches using the Google Gemini API.
*   Provides a brief trend analysis for the given niche.
*   Suggests YouTube search queries to find relevant content.
*   Fetches and displays recent trending videos from YouTube based on the AI's suggestions.

## Setup and Configuration

To run this application, you need to configure API keys for the Google Gemini API and the YouTube Data API.

1.  **API Keys:**
    *   `API_KEY`: Your Google Gemini API key.
    *   `YOUTUBE_API_KEY`: Your YouTube Data API v3 key.

2.  **Environment Variables:**
    These keys must be set as environment variables. The application will look for `process.env.API_KEY` and `process.env.YOUTUBE_API_KEY`.

    For local development, you can create a `.env` file in the root of the project with the following content:
    ```
    API_KEY="YOUR_GEMINI_API_KEY"
    YOUTUBE_API_KEY="YOUR_YOUTUBE_API_KEY"
    ```
    Replace the placeholder values with your actual API keys. Ensure your development environment or server is configured to load these variables.

## Running the Application

1.  Ensure you have set up your API keys as environment variables (see Setup section).
2.  Open the `index.html` file in your web browser.
    Alternatively, you can serve the project directory using a simple HTTP server. For example, using Python:
    ```bash
    python -m http.server
    ```
    Then navigate to `http://localhost:8000` (or the port shown by the server) in your browser.

## Technologies Used

*   React
*   Tailwind CSS
*   Google Gemini API (@google/genai)
*   YouTube Data API
