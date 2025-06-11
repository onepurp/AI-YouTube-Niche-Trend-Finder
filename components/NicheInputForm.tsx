
import React, { useState } from 'react';
import { NicheInputFormProps } from '../types';

const NicheInputForm: React.FC<NicheInputFormProps> = ({ onSubmit, isLoading }) => {
  const [niche, setNiche] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (niche.trim()) {
      onSubmit(niche.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-lg shadow-md">
      <label htmlFor="niche-input" className="block text-lg font-medium text-gray-700 mb-2">
        Enter YouTube Niche
      </label>
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          id="niche-input"
          type="text"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          placeholder="e.g., 'Fortnite Gaming', 'Vegan Cooking', 'AI Startups'"
          className="flex-grow p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 placeholder-gray-400"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !niche.trim()}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out"
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Find Trends'}
        </button>
      </div>
    </form>
  );
};

export default NicheInputForm;
