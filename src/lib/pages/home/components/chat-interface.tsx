import { useEffect, useState } from 'react';
import { ChatInput } from './chat-input'; // Adjust path
// Import new components
import { MessageList } from './message-list'; // Adjust path

// Keep ChatMessage type definition here or move to a shared types file
interface ChatMessage {
  role: string;
  content: string;
}

interface ChatInterfaceProps {
  messages: Array<ChatMessage>;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  error: string | null;
  hasSubmittedInput?: boolean; // Optional prop from parent
  onInputSubmitted?: () => void; // Optional callback for parent
}

// Define categories here if needed by parent, otherwise they are encapsulated in ChatInput
type CategoryKey = 'results' | 'enrolling' | 'matching';

export const ChatInterface = ({
  messages,
  onSendMessage: parentOnSendMessage, // Rename to avoid conflict
  isLoading,
  error,
  hasSubmittedInput: externalHasSubmittedInput,
  onInputSubmitted,
}: ChatInterfaceProps) => {
  const [inputValue, setInputValue] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [internalHasSubmittedInput, setInternalHasSubmittedInput] =
    useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(
    null,
  );

  // Use external state if provided, otherwise use internal state
  const hasSubmittedInput =
    externalHasSubmittedInput !== undefined
      ? externalHasSubmittedInput
      : internalHasSubmittedInput;

  const hasMessages = messages.length > 0;
  const shouldShowStickyInput = hasMessages || hasSubmittedInput || isLoading;

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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const markAsSubmitted = () => {
    if (!hasSubmittedInput) {
      setInternalHasSubmittedInput(true);
      onInputSubmitted?.(); // Notify parent if callback provided
    }
  };

  // Combined send message handler for ChatInput
  const handleSendMessage = (message: string) => {
    if (message.trim() && !isLoading) {
      markAsSubmitted();
      parentOnSendMessage(message); // Call the original prop function
      setInputValue(''); // Clear input after sending
      setActiveCategory(null); // Close examples after sending
    }
  };

  const handleToggleCategory = (category: CategoryKey) => {
    setActiveCategory((prev) => (prev === category ? null : category));
  };

  return (
    <div className="flex flex-col w-full h-full">
      {' '}
      {/* Ensure full height if needed */}
      {/* Chat messages area */}
      <div className="flex-grow overflow-y-auto">
        {' '}
        {/* Make message list scrollable */}
        <MessageList messages={messages} />
      </div>
      {/* Error message */}
      {error && (
        <div className="p-4 max-w-3xl mx-auto w-full">
          <div className="rounded-xl bg-red-50 p-4 text-red-800 shadow-sm dark:bg-red-900/20 dark:text-red-200">
            <p>{error}</p>
          </div>
        </div>
      )}
      {/* Input Area - Conditionally Rendered: Initial Centered or Sticky Bottom */}
      {!shouldShowStickyInput && (
        // Centered input before messages/submission
        <div className="w-full max-w-2xl mx-auto px-4 pt-4 pb-8">
          {' '}
          {/* Adjusted padding */}
          <ChatInput
            inputValue={inputValue}
            onInputChange={handleInputChange}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            placeholder={placeholder}
            showExamples={true} // Always show examples initially
            activeCategory={activeCategory}
            onToggleCategory={handleToggleCategory}
          />
        </div>
      )}
      {shouldShowStickyInput && (
        // Sticky input at the bottom
        <div className="sticky bottom-0 left-0 right-0 p-3 sm:p-4 backdrop-blur-md bg-white/50 dark:bg-gray-900/50 border-t border-gray-200/50 dark:border-gray-700/50 z-50 transition-all duration-300 ease-in-out">
          <div className="max-w-3xl mx-auto">
            <ChatInput
              inputValue={inputValue}
              onInputChange={handleInputChange}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              placeholder={placeholder}
              showExamples={false} // Do not show examples in sticky mode
              activeCategory={null} // Don't need category state in sticky
              onToggleCategory={() => {}} // No-op toggle in sticky
            />
          </div>
        </div>
      )}
      {/* Spacer div only needed if using sticky input to prevent overlap */}
      {/* {shouldShowStickyInput && <div className="h-28 sm:h-24 flex-shrink-0" />} */}
      {/* Note: Using sticky positioning often removes the need for a spacer if the scrollable container (`flex-grow`) handles the padding-bottom */}
    </div>
  );
};
