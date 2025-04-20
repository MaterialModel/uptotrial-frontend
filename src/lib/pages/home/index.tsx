import { useState } from 'react';
import { getMockTrials } from './components/mock-data';
import { SearchBar } from './components/search-bar';
import { TrialCard } from './components/trial-card';
import type { Trial } from './components/trial-card';

const Home = () => {
  const [searchResults, setSearchResults] = useState<Array<Trial>>([]);
  const [isSearched, setIsSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearched(true);
    // Mock API call - in the future, this would be an actual API request
    const results = getMockTrials(query);
    setSearchResults(results);
    setActiveCategory(null);
  };

  const questionCategories = [
    {
      id: 'results',
      name: 'Trials with results',
      examples: [
        'Show me completed trials for breast cancer with positive results',
        'Find phase 3 diabetes trials that reported efficacy over 50%',
        'What heart disease trials had significant outcomes in the last 5 years',
      ],
    },
    {
      id: 'enrolling',
      name: 'Currently enrolling',
      examples: [
        'Find recruiting lung cancer trials near Boston',
        'Show me ongoing trials for children with rare genetic disorders',
        "What Alzheimer's prevention studies are currently enrolling healthy adults",
      ],
    },
    {
      id: 'patient',
      name: 'Patient-specific deep-dive',
      examples: [
        'Find trials for stage 3 colon cancer patients who failed first-line therapy',
        'What options exist for elderly patients with treatment-resistant depression',
        'Show me trials accepting patients with both diabetes and kidney disease',
      ],
    },
  ];

  const toggleCategory = (categoryId: string) => {
    if (activeCategory === categoryId) {
      setActiveCategory(null);
    } else {
      setActiveCategory(categoryId);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 py-12 sm:px-4 md:px-8 lg:px-12">
      <div className="mb-2 text-center">
        <img
          src="/assets/uptotrail.svg"
          alt="UpToTrial Logo"
          className="mx-auto mb-4 h-24 w-auto"
        />
        <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
          <span
            className="text-black dark:text-white tracking-tight"
            style={{
              fontFamily:
                "'Gantari', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}
          >
            UpToTrial
          </span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          Searching clinicaltrials.gov just got a whole lot easier
        </p>
      </div>

      <div className="w-full min-w-[320px] md:min-w-[640px] lg:min-w-[768px] max-w-6xl">
        <SearchBar onSearch={handleSearch} />

        <div className="mt-4">
          <div className="flex flex-wrap justify-center gap-3 mb-2">
            {questionCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => toggleCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-[#008BB0] text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {activeCategory && (
            <div className="mt-3 flex flex-col gap-2 animate-fadeIn">
              {questionCategories
                .find((cat) => cat.id === activeCategory)
                ?.examples.map((example) => (
                  <button
                    key={`example-${example.substring(0, 10)}`}
                    type="button"
                    onClick={() => handleSearch(example)}
                    className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    {example}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>

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
            Find the exact clinical trials you're looking for
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Our agentic search auto-refines queries of the entire
            clinicaltrials.gov database.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
