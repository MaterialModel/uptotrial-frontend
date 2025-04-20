import { useEffect, useRef, useState } from 'react';

export const SearchBar = ({
  onSearch,
}: { onSearch: (query: string) => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <svg
          className="absolute left-5 top-[calc(50%_-_2px)] -translate-y-1/2 h-6 w-6 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          role="img"
          aria-label="Search icon"
        >
          <title>Search icon</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder={placeholder}
          className="w-full resize-none overflow-y-hidden rounded-full border border-gray-300 bg-white pl-14 pr-20 pt-[1.25rem] pb-[1.15rem] text-gray-900 text-lg leading-normal shadow-md transition-all focus:border-[#44B8D7] focus:outline-none focus:ring-2 focus:ring-[#44B8D7] dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-[#44B8D7] dark:focus:ring-[#44B8D7]"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          type="submit"
          className="absolute right-2 top-[calc(50%_-_2px)] -translate-y-1/2 rounded-full bg-[#008BB0] p-3 text-base font-semibold text-white transition-all hover:bg-[#007291] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#008BB0] focus:ring-offset-2 dark:hover:bg-[#007291]"
          aria-label="Search"
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={4}
            role="img"
            aria-label="Arrow icon"
          >
            <title>Arrow icon</title>
            <path
              strokeLinecap="butt"
              strokeLinejoin="miter"
              d="M8 4l8 8-8 8"
            />
          </svg>
        </button>
      </div>
    </form>
  );
};
