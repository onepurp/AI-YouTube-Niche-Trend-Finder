
import { VideoInfo } from '../types';
import { YOUTUBE_API_BASE_URL } from '../constants';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

if (!YOUTUBE_API_KEY) {
  console.warn("YOUTUBE_API_KEY environment variable not set. YouTube video fetching will be disabled.");
}

const MAX_VIDEOS_TO_FETCH = 5; // Max videos to fetch per search query

// Helper to get date string for 'publishedAfter' (e.g., 7 days ago)
const getPublishedAfterDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export const fetchYouTubeVideosBySearchQuery = async (query: string): Promise<VideoInfo[]> => {
  if (!YOUTUBE_API_KEY) {
    return Promise.reject(new Error("YouTube Video Fetching Disabled: The YOUTUBE_API_KEY environment variable is not configured. Please set this environment variable to enable fetching YouTube videos."));
  }

  try {
    // Step 1: Search for videos to get video IDs
    const searchParams = new URLSearchParams({
      part: 'snippet',
      q: query,
      type: 'video',
      order: 'viewCount', // or 'relevance', 'date'
      maxResults: String(MAX_VIDEOS_TO_FETCH),
      publishedAfter: getPublishedAfterDate(7), // Videos published in the last 7 days
      key: YOUTUBE_API_KEY,
    });
    const searchUrl = `${YOUTUBE_API_BASE_URL}/search?${searchParams.toString()}`;
    const searchResponse = await fetch(searchUrl);

    if (!searchResponse.ok) {
      const errorData = await searchResponse.json().catch(() => ({}));
      console.error("YouTube Search API error:", searchResponse.status, errorData);
      throw new Error(`YouTube Search API request failed: ${searchResponse.statusText} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const searchData = await searchResponse.json();
    const videoIds = searchData.items?.map((item: any) => item.id?.videoId).filter(Boolean) || [];

    if (videoIds.length === 0) {
      return []; // No videos found for this query
    }

    // Step 2: Get details (including statistics) for the found video IDs
    const videoDetailsParams = new URLSearchParams({
      part: 'snippet,statistics,contentDetails', // contentDetails for duration, if needed later
      id: videoIds.join(','),
      key: YOUTUBE_API_KEY,
    });
    const videoDetailsUrl = `${YOUTUBE_API_BASE_URL}/videos?${videoDetailsParams.toString()}`;
    const videoDetailsResponse = await fetch(videoDetailsUrl);

    if (!videoDetailsResponse.ok) {
      const errorData = await videoDetailsResponse.json().catch(() => ({}));
      console.error("YouTube Videos API error:", videoDetailsResponse.status, errorData);
      throw new Error(`YouTube Videos API request failed: ${videoDetailsResponse.statusText} - ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const videoDetailsData = await videoDetailsResponse.json();

    // Map API response to VideoInfo[]
    const videos: VideoInfo[] = videoDetailsData.items?.map((item: any) => ({
      videoId: item.id,
      title: item.snippet?.title || 'No title',
      channelId: item.snippet?.channelId || '',
      channelTitle: item.snippet?.channelTitle || 'Unknown channel',
      // Ensure counts are numbers, default to 0 if missing/invalid
      viewCount: parseInt(item.statistics?.viewCount, 10) || 0,
      likeCount: parseInt(item.statistics?.likeCount, 10) || 0,
      commentCount: parseInt(item.statistics?.commentCount, 10) || 0,
      description: item.snippet?.description || '',
      tags: item.snippet?.tags || [],
      thumbnailUrl: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || `https://via.placeholder.com/320x180.png?text=No+Thumbnail`,
      publishedAt: item.snippet?.publishedAt || '',
    })) || [];
    
    return videos;

  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    if (error instanceof Error) {
      // If the error is the specific API key configuration error, ensure it's propagated clearly.
      if (error.message.startsWith("YouTube Video Fetching Disabled:")) {
        throw error;
      }
      // For other errors from YouTube API calls or processing:
      throw new Error(`Failed to retrieve YouTube videos: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching YouTube videos.");
  }
};
