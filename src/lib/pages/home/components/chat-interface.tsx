import { useEffect, useRef, useState } from 'react';

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatInterfaceProps {
  messages: Array<ChatMessage>;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  error: string | null;
}

export const ChatInterface = ({
  messages,
  onSendMessage,
  isLoading,
  error,
}: ChatInterfaceProps) => {
  const [inputValue, setInputValue] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
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

  return (
    <div className="flex flex-col w-full">
      {/* Chat messages */}
      {messages.length > 0 && (
        <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col gap-4">
            {messages.map((message, idx) => (
              <div
                key={`message-${idx}-${message.role}`}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3/4 rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-[#008BB0] text-white'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-800 dark:bg-red-800 dark:text-red-100">
          <p>{error}</p>
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <svg
            className="absolute left-5 top-[calc(50%_-_2px)] -translate-y-1/2 h-6 w-6 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            role="img"
            aria-label="Chat icon"
          >
            <title>Chat icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder={placeholder}
            className="w-full resize-none overflow-y-hidden rounded-full border border-gray-300 bg-white pl-14 pr-20 pt-[1.25rem] pb-[1.15rem] text-gray-900 text-lg leading-normal shadow-md transition-all focus:border-[#44B8D7] focus:outline-none focus:ring-2 focus:ring-[#44B8D7] dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-[#44B8D7] dark:focus:ring-[#44B8D7]"
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
                strokeWidth={4}
                role="img"
                aria-label="Send icon"
              >
                <title>Send icon</title>
                <path
                  strokeLinecap="butt"
                  strokeLinejoin="miter"
                  d="M8 4l8 8-8 8"
                />
              </svg>
            )}
          </button>
        </div>
      </form>

      {/* Welcome message when no messages */}
      {messages.length === 0 && !isLoading && (
        <div className="mt-8 w-full rounded-lg border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200">
            Find the exact clinical trials you're looking for
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Our agentic search auto-refines queries of the entire
            clinicaltrials.gov database.
          </p>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Try asking:
            </p>
            <button
              type="button"
              onClick={() =>
                onSendMessage(
                  'Show me completed trials for breast cancer with positive results',
                )
              }
              className="w-full text-left p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 text-sm text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Show me completed trials for breast cancer with positive results
            </button>
            <button
              type="button"
              onClick={() =>
                onSendMessage('Find recruiting lung cancer trials near Boston')
              }
              className="w-full text-left p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 text-sm text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Find recruiting lung cancer trials near Boston
            </button>
            <button
              type="button"
              onClick={() =>
                onSendMessage(
                  'Find trials for stage 3 colon cancer patients who failed first-line therapy',
                )
              }
              className="w-full text-left p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 text-sm text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Find trials for stage 3 colon cancer patients who failed
              first-line therapy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
