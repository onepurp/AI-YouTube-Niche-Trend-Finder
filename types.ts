
export interface VideoInfo {
  videoId: string;
  title: string;
  channelId: string;
  channelTitle: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  description: string;
  tags: string[];
  thumbnailUrl: string; // Added for real YouTube thumbnail
  publishedAt: string; // Added for video recency context
}

export interface GeminiApiResponse {
  trendAnalysis: string;
  suggestedSearchQueries: string[];
}

// Props for UI components
export interface NicheInputFormProps {
  onSubmit: (niche: string) => void;
  isLoading: boolean;
}

export interface VideoCardProps {
  video: VideoInfo;
}

export interface ErrorMessageProps {
  message: string;
}
