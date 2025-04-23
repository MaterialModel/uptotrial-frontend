import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatInterfaceProps {
  messages: Array<ChatMessage>;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  error: string | null;
  hasSubmittedInput?: boolean;
  onInputSubmitted?: () => void;
}

export const ChatInterface = ({
  messages,
  onSendMessage,
  isLoading,
  error,
  hasSubmittedInput: externalHasSubmittedInput,
  onInputSubmitted,
}: ChatInterfaceProps) => {
  const [inputValue, setInputValue] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [internalHasSubmittedInput, setInternalHasSubmittedInput] =
    useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use external state if provided, otherwise use internal state
  const hasSubmittedInput =
    externalHasSubmittedInput !== undefined
      ? externalHasSubmittedInput
      : internalHasSubmittedInput;

  const hasMessages = messages.length > 0;
  const shouldShowStickyInput = hasMessages || hasSubmittedInput || isLoading;

  // Example queries for each category
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

  // Update placeholder based on screen size
  useEffect(() => {
    const updatePlaceholder = () => {
      if (window.innerWidth < 640) {
        setPlaceholder('Ask about trials');
      } else if (window.innerWidth < 1024) {
        setPlaceholder('Give me your most ambitious request...');
      } else {
        setPlaceholder('Give me your most ambitious trial finding request...');
      }
    };

    updatePlaceholder();
    window.addEventListener('resize', updatePlaceholder);

    return () => window.removeEventListener('resize', updatePlaceholder);
  }, []);

  // Auto-adjust height of textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const markAsSubmitted = () => {
    if (!hasSubmittedInput) {
      setInternalHasSubmittedInput(true);
      onInputSubmitted?.();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      markAsSubmitted();
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleCategory = (category: string) => {
    if (activeCategory === category) {
      setActiveCategory(null);
    } else {
      setActiveCategory(category);
    }
  };

  // Input form component used in both initial and sticky states
  const InputForm = () => (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder={placeholder}
          className={
            'w-full resize-none overflow-y-hidden rounded-[40px] border border-gray-300 bg-white pl-5 pr-20 pt-[1.25rem] pb-[1.15rem] text-gray-900 text-lg leading-normal shadow-md transition-all focus:border-[#44B8D7] focus:outline-none focus:ring-2 focus:ring-[#44B8D7] dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-[#44B8D7] dark:focus:ring-[#44B8D7]'
          }
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button
          type="submit"
          className={`absolute right-2 top-[calc(50%_-_2px)] -translate-y-1/2 rounded-full p-3 text-base font-semibold text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#008BB0] hover:bg-[#007291] hover:shadow-md focus:ring-[#008BB0]'
          }`}
          aria-label="Send"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg
              className="h-6 w-6 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <title>Loading spinner</title>
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
              role="img"
              aria-label="Send icon"
            >
              <title>Send icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 4l8 8-8 8"
              />
            </svg>
          )}
        </button>
      </div>

      {!hasMessages && (
        <div className="mt-3 flex flex-col gap-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {/* Category buttons */}
            <button
              type="button"
              onClick={() => toggleCategory('results')}
              className={`text-left p-3 bg-gray-50 border rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 ${
                activeCategory === 'results'
                  ? 'border-[#44B8D7] bg-[#E5F1F4] dark:bg-[#0f3a47]'
                  : 'border-gray-200'
              }`}
            >
              Trials with results
            </button>
            <button
              type="button"
              onClick={() => toggleCategory('enrolling')}
              className={`text-left p-3 bg-gray-50 border rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 ${
                activeCategory === 'enrolling'
                  ? 'border-[#44B8D7] bg-[#E5F1F4] dark:bg-[#0f3a47]'
                  : 'border-gray-200'
              }`}
            >
              Currently enrolling
            </button>
            <button
              type="button"
              onClick={() => toggleCategory('matching')}
              className={`text-left p-3 bg-gray-50 border rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 ${
                activeCategory === 'matching'
                  ? 'border-[#44B8D7] bg-[#E5F1F4] dark:bg-[#0f3a47]'
                  : 'border-gray-200'
              }`}
            >
              Patient-specific matching
            </button>
          </div>

          {/* Example queries for the selected category */}
          {activeCategory && (
            <div className="mt-2 flex flex-col gap-2 animate-fadeIn">
              {categoryQueries[
                activeCategory as keyof typeof categoryQueries
              ].map((query, _idx) => (
                <button
                  key={`${activeCategory}-query-${query}`}
                  type="button"
                  onClick={() => {
                    markAsSubmitted();
                    onSendMessage(query);
                  }}
                  className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
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

  // Sticky input form component (identical for now)
  const InputFormSticky = () => (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder={placeholder}
          className={
            'w-full resize-none overflow-y-hidden rounded-[40px] border border-gray-300 bg-white pl-5 pr-20 pt-[1.25rem] pb-[1.15rem] text-gray-900 text-lg leading-normal shadow-md transition-all focus:border-[#44B8D7] focus:outline-none focus:ring-2 focus:ring-[#44B8D7] dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-[#44B8D7] dark:focus:ring-[#44B8D7]'
          }
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button
          type="submit"
          className={`absolute right-2 top-[calc(50%_-_2px)] -translate-y-1/2 rounded-full p-3 text-base font-semibold text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#008BB0] hover:bg-[#007291] hover:shadow-md focus:ring-[#008BB0]'
          }`}
          aria-label="Send"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg
              className="h-6 w-6 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <title>Loading spinner</title>
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
              role="img"
              aria-label="Send icon"
            >
              <title>Send icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 4l8 8-8 8"
              />
            </svg>
          )}
        </button>
      </div>

      {!hasMessages && (
        <div className="mt-3 flex flex-col gap-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {/* Category buttons */}
            <button
              type="button"
              onClick={() => toggleCategory('results')}
              className={`text-left p-3 bg-gray-50 border rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 ${
                activeCategory === 'results'
                  ? 'border-[#44B8D7] bg-[#E5F1F4] dark:bg-[#0f3a47]'
                  : 'border-gray-200'
              }`}
            >
              Trials with results
            </button>
            <button
              type="button"
              onClick={() => toggleCategory('enrolling')}
              className={`text-left p-3 bg-gray-50 border rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 ${
                activeCategory === 'enrolling'
                  ? 'border-[#44B8D7] bg-[#E5F1F4] dark:bg-[#0f3a47]'
                  : 'border-gray-200'
              }`}
            >
              Currently enrolling
            </button>
            <button
              type="button"
              onClick={() => toggleCategory('matching')}
              className={`text-left p-3 bg-gray-50 border rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 ${
                activeCategory === 'matching'
                  ? 'border-[#44B8D7] bg-[#E5F1F4] dark:bg-[#0f3a47]'
                  : 'border-gray-200'
              }`}
            >
              Patient-specific matching
            </button>
          </div>

          {/* Example queries for the selected category */}
          {activeCategory && (
            <div className="mt-2 flex flex-col gap-2 animate-fadeIn">
              {categoryQueries[
                activeCategory as keyof typeof categoryQueries
              ].map((query, _idx) => (
                <button
                  key={`${activeCategory}-query-${query}`}
                  type="button"
                  onClick={() => {
                    markAsSubmitted();
                    onSendMessage(query);
                  }}
                  className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
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

  return (
    <div className="flex flex-col w-full">
      {/* Chat messages */}
      {messages.length > 0 && (
        <div className="mb-4 p-4 max-w-3xl mx-auto w-full">
          <div className="flex flex-col gap-6">
            {messages.map((message, idx) => (
              <div
                key={`message-${idx}-${message.role}`}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start w-full'}`}
              >
                <div
                  className={`${
                    message.role === 'user'
                      ? 'max-w-full bg-gray-50 text-gray-800 border border-[#44B8D7] dark:bg-[#0f3a47]'
                      : 'w-full text-gray-800 dark:text-gray-200'
                  } ${message.role === 'user' ? 'rounded-lg px-3 py-2' : 'rounded-3xl p-3'} backdrop-blur-sm transform transition-all duration-200`}
                >
                  <div
                    className={`prose dark:prose-invert prose-sm sm:prose-base ${message.role !== 'user' ? 'max-w-none' : 'font-semibold'}`}
                  >
                    <ReactMarkdown
                      components={{
                        a: ({ node, ...props }) => (
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                          />
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-4 text-red-800 shadow-sm dark:bg-red-900/20 dark:text-red-200">
          <p>{error}</p>
        </div>
      )}

      {/* Initial centered input before any messages */}
      {!shouldShowStickyInput && (
        <div className="w-full max-w-2xl mx-auto px-4 mb-8">
          <InputForm />
        </div>
      )}

      {/* Sticky input form - visible when there are messages or input has been submitted */}
      {shouldShowStickyInput && (
        <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 backdrop-blur-md bg-white/50 dark:bg-gray-900/50 border-t border-gray-200/50 dark:border-gray-700/50 z-50 transition-all duration-300 ease-in-out">
          <div className="max-w-3xl mx-auto">
            <InputFormSticky />
          </div>
        </div>
      )}

      {/* Add padding at the bottom when input is sticky to prevent content from being hidden */}
      {shouldShowStickyInput && <div className="h-28 sm:h-24" />}
    </div>
  );
};
