
import React from 'react';
import { VideoCardProps } from '../types';
import { YOUTUBE_VIDEO_URL_PREFIX, YOUTUBE_CHANNEL_URL_PREFIX } from '../constants';

const EyeIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const HeartIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
);

const ChatBubbleIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3.697-3.697c-.023.008-.044.015-.066.022H6.75A2.25 2.25 0 0 1 4.5 15V7.5a2.25 2.25 0 0 1 2.25-2.25h9.802c.501-.005.995.022 1.478.07Z" />
  </svg>
);

const CalendarDaysIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
);


const formatCount = (count: number): string => {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
  if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
  return count.toString();
};

const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  } catch (e) {
    return 'Invalid Date';
  }
};


const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const videoUrl = `${YOUTUBE_VIDEO_URL_PREFIX}${video.videoId}`;
  const channelUrl = `${YOUTUBE_CHANNEL_URL_PREFIX}${video.channelId}`;
  const imageUrl = video.thumbnailUrl;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl flex flex-col">
      <a href={videoUrl} target="_blank" rel="noopener noreferrer" aria-label={`Watch video: ${video.title}`}>
        <img src={imageUrl} alt={video.title} className="w-full h-48 object-cover" />
      </a>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 leading-tight">
          <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">
            {video.title}
          </a>
        </h3>
        <p className="text-sm text-gray-600 mb-1">
          By: <a href={channelUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">{video.channelTitle}</a>
        </p>
         <p className="text-xs text-gray-500 mb-2 flex items-center" title="Published date">
          <CalendarDaysIcon className="w-4 h-4 mr-1 text-gray-400" /> {formatDate(video.publishedAt)}
        </p>
        <p className="text-xs text-gray-500 mb-3 leading-relaxed flex-grow min-h-[60px] overflow-hidden text-ellipsis" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
          {video.description || "No description available."}
        </p>
        
        <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-3 text-center">
          <div className="flex items-center justify-center flex-col" title="Views">
            <EyeIcon className="w-5 h-5 mb-0.5 text-sky-500" /> {formatCount(video.viewCount)}
          </div>
          <div className="flex items-center justify-center flex-col" title="Likes">
            <HeartIcon className="w-5 h-5 mb-0.5 text-red-500" /> {formatCount(video.likeCount)}
          </div>
          <div className="flex items-center justify-center flex-col" title="Comments">
            <ChatBubbleIcon className="w-5 h-5 mb-0.5 text-green-500" /> {formatCount(video.commentCount)}
          </div>
        </div>

        {video.tags && video.tags.length > 0 && (
          <div className="mb-4 h-16 overflow-y-auto"> {/* Added fixed height and scroll for tags */}
            <p className="text-xs font-medium text-gray-500 mb-1 sticky top-0 bg-white">Tags:</p>
            <div className="flex flex-wrap gap-1">
              {video.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto block w-full text-center px-4 py-2 bg-red-600 text-white font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
        >
          Watch on YouTube
        </a>
      </div>
    </div>
  );
};

export default VideoCard;
