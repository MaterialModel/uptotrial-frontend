import { useState } from 'react';
import { getMockTrials } from './components/mock-data';
import { SearchBar } from './components/search-bar';
import { TrialCard } from './components/trial-card';
import type { Trial } from './components/trial-card';

const Home = () => {
  const [searchResults, setSearchResults] = useState<Array<Trial>>([]);
  const [isSearched, setIsSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearched(true);
    // Mock API call - in the future, this would be an actual API request
    const results = getMockTrials(query);
    setSearchResults(results);
  };

  return (
    <div className="flex flex-col items-center gap-8 px-4 py-12">
      <div className="mb-2 text-center">
        <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
          <span className="bg-linear-to-br from-teal-400 to-teal-700 bg-clip-text text-transparent">
            UpToTrial
          </span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          AI-powered search for clinical trials at ClinicalTrials.gov
        </p>
      </div>

      <SearchBar onSearch={handleSearch} />

      {isSearched && (
        <div className="w-full max-w-5xl">
          <div className="mb-4">
            {searchResults.length > 0 ? (
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Found {searchResults.length} trials for "{searchQuery}"
              </h2>
            ) : (
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                No trials found for "{searchQuery}"
              </h2>
            )}
          </div>

          {searchResults.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {searchResults.map((trial) => (
                <TrialCard key={trial.id} trial={trial} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
              <p className="text-gray-600 dark:text-gray-300">
                No clinical trials match your search criteria. Try different
                keywords or broaden your search.
              </p>
            </div>
          )}
        </div>
      )}

      {!isSearched && (
        <div className="mt-8 w-full max-w-3xl rounded-lg border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200">
            Find the right clinical trial for you
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Search by condition (e.g., "diabetes"), treatment (e.g.,
            "immunotherapy"), or keyword to find relevant clinical trials.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
