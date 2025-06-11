
import React, { useState, useCallback } from 'react';
import { GeminiApiResponse, VideoInfo } from './types';
import { APP_TITLE } from './constants';
import { fetchTrendAnalysisFromGemini } from './services/geminiService';
import { fetchYouTubeVideosBySearchQuery } from './services/youtubeService';
import NicheInputForm from './components/NicheInputForm';
import VideoCard from './components/VideoCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

const App: React.FC = () => {
  const [trendAnalysis, setTrendAnalysis] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [currentNiche, setCurrentNiche] = useState<string | null>(null);

  const handleNicheSubmit = useCallback(async (niche: string) => {
    setIsLoading(true);
    setError(null);
    setTrendAnalysis(null);
    setVideos([]);
    setCurrentNiche(niche);

    try {
      setLoadingMessage('Analyzing niche with AI...');
      const geminiResult = await fetchTrendAnalysisFromGemini(niche);
      setTrendAnalysis(geminiResult.trendAnalysis); // Set trend analysis first

      if (geminiResult.suggestedSearchQueries && geminiResult.suggestedSearchQueries.length > 0) {
        setLoadingMessage(`Fetching YouTube videos for query: "${geminiResult.suggestedSearchQueries[0]}"...`);
        const fetchedVideos = await fetchYouTubeVideosBySearchQuery(geminiResult.suggestedSearchQueries[0]);
        setVideos(fetchedVideos);
        if (fetchedVideos.length === 0) {
           console.log("No videos found for the suggested query.");
        }
      } else {
         // This error will be set if Gemini provides no queries.
         // If trendAnalysis was set, it will still be shown.
         setError("AI provided analysis but no search queries to find videos.");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message); // This will capture errors from both Gemini and YouTube calls
      } else {
        setError('An unexpected error occurred.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 sm:text-5xl">
            {APP_TITLE}
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Enter a YouTube niche to get AI-powered trend analysis and discover relevant, recent videos.
          </p>
        </header>

        <NicheInputForm onSubmit={handleNicheSubmit} isLoading={isLoading} />

        {isLoading && <LoadingSpinner message={loadingMessage} />}
        
        {/* Display general error if it occurred before trend analysis was available */}
        {!isLoading && error && !trendAnalysis && <ErrorMessage message={error} />}

        {/* Container for results, shown if not loading AND a niche has been submitted */}
        {!isLoading && currentNiche && (
          <div className="mt-12">
            {/* Display Trend Analysis if available */}
            {trendAnalysis && (
              <section className="mb-10 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                  AI Trend Analysis for "{currentNiche}"
                </h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{trendAnalysis}</p>
              </section>
            )}

            {/* Display error related to YouTube AFTER trend analysis, if analysis is present and an error occurred */}
            {!isLoading && error && trendAnalysis && (
              <div className="mt-6">
                <ErrorMessage message={error} />
              </div>
            )}
            
            {/* Display videos only if trend analysis is available AND no error occurred (meaning YouTube call was successful) */}
            {!isLoading && trendAnalysis && !error && videos.length > 0 && (
              <section className="mt-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Example Trending Videos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <VideoCard key={video.videoId} video={video} />
                  ))}
                </div>
              </section>
            )}
            
            {/* Display "no videos found" message if trend analysis is available, no error, and no videos */}
            {!isLoading && trendAnalysis && !error && videos.length === 0 && (
                 <section className="mt-6 mb-10 p-6 bg-white rounded-lg shadow-md text-center">
                    <p className="text-gray-600 text-lg">
                        AI analysis complete. No specific videos were found for the top suggested search query at this time.
                    </p>
                 </section>
            )}
          </div>
        )}
         <footer className="mt-16 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} AI YouTube Niche Trend Finder. All rights reserved (conceptually).</p>
          <p>Powered by Gemini API & YouTube Data API.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
