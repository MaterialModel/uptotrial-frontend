import type React from 'react';
import { useEffect, useRef } from 'react';
// import { LoadingSpinner } from './loading-spinner'; // Adjust path - REMOVED
import { SendIcon } from './send-icon'; // Adjust path

// Define categoryQueries directly here or pass as prop if it needs to be dynamic
const categoryQueries = {
  results: [
    'Show me completed trials for breast cancer with positive results',
    "Find trials for Alzheimer's disease that demonstrated efficacy",
    'What diabetes trials have been completed with significant results',
  ],
  enrolling: [
    'Find recruiting lung cancer trials near Boston',
    'Show me enrolling trials for melanoma in California',
    'What pediatric leukemia trials are currently recruiting',
  ],
  matching: [
    'Find trials for stage 3 colon cancer patients who failed first-line therapy',
    'Trials for a 65-year-old female with HER2+ breast cancer',
    'Match me with trials for treatment-resistant depression',
  ],
};

type CategoryKey = keyof typeof categoryQueries;

interface ChatInputProps {
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSendMessage: (message: string) => void; // For sending regular and example messages
  isLoading: boolean;
  placeholder: string;
  showExamples: boolean; // Control visibility of example section
  activeCategory: CategoryKey | null;
  onToggleCategory: (category: CategoryKey) => void;
  isSticky?: boolean; // Whether the input is in sticky mode
}

export const ChatInput = ({
  inputValue,
  onInputChange,
  onSendMessage,
  isLoading,
  placeholder,
  showExamples,
  activeCategory,
  onToggleCategory,
  isSticky = false, // Default to false
}: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-adjust height of textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to scroll height
    }
  }, [inputValue]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e);
    // Adjust height immediately on typing
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      // Clearing input is handled by the parent state update
      // Reset height after sending
      if (textareaRef.current) {
        // Delay slightly to allow state update cycle
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
          }
        }, 0);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleExampleClick = (query: string) => {
    onSendMessage(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Input Textarea and Button */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder={placeholder}
          className={`w-full resize-none overflow-y-hidden rounded-[40px] border border-gray-300 bg-white pl-5 pr-20 pt-[1.25rem] pb-[1.15rem] text-gray-900 text-md leading-normal ${!isSticky ? 'shadow-md' : ''} transition-all focus:border-[#44B8D7] focus:outline-none focus:ring-2 focus:ring-[#44B8D7] dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-[#44B8D7] dark:focus:ring-[#44B8D7]`}
          value={inputValue}
          onChange={handleTextareaChange} // Use updated handler
          onKeyDown={handleKeyDown}
          style={{ maxHeight: '150px' }} // Optional: prevent excessive growth
        />
        <button
          type="submit"
          className={`absolute right-2 top-[calc(50%_-_2px)] -translate-y-1/2 rounded-full p-3 text-base font-semibold text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#008BB0] hover:bg-[#007291] hover:shadow-md focus:ring-[#008BB0]'
          }`}
          aria-label="Send message"
          disabled={isLoading || !inputValue.trim()} // Disable if input is empty too
        >
          <SendIcon />
        </button>
      </div>

      {/* Example Queries Section */}
      {showExamples && (
        <div className="mt-3 flex flex-col gap-2">
          {/* Category Buttons */}
          <div className="flex flex-wrap justify-center gap-2">
            {(Object.keys(categoryQueries) as Array<CategoryKey>).map(
              (catKey) => {
                // Create readable labels if needed, or use keys directly
                const categoryLabels: Record<CategoryKey, string> = {
                  results: 'Trials with results',
                  enrolling: 'Currently enrolling',
                  matching: 'Patient-specific matching',
                };
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => onToggleCategory(catKey)}
                    className={`inline-flex px-3 py-2 bg-gray-50 border rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 ${
                      activeCategory === catKey
                        ? 'border-[#44B8D7] bg-[#E5F1F4] dark:bg-[#0f3a47]'
                        : 'border-gray-200'
                    }`}
                  >
                    {categoryLabels[catKey]}
                  </button>
                );
              },
            )}
          </div>

          {/* Example Queries for Selected Category */}
          {activeCategory && (
            <div className="mt-2 flex flex-col gap-2 animate-fadeIn">
              {categoryQueries[activeCategory].map((query) => (
                <button
                  key={`${activeCategory}-query-${query}`} // More robust key if queries aren't unique
                  type="button"
                  onClick={() => handleExampleClick(query)}
                  className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                  disabled={isLoading} // Disable example buttons while loading
                >
                  {query}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </form>
  );
};
