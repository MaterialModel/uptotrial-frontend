import { useEffect, useState, useRef } from 'react';
import { ChatInput } from './chat-input'; // Adjust path
// Import new components
import { MessageList } from './message-list'; // Adjust path

// Custom event name for chat input sticky state changes
const CHAT_INPUT_STICKY_EVENT = 'chatInputStickyChange';

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
  onFooterVisibilityChange?: (visible: boolean) => void; // Callback to control original footer visibility
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
  onFooterVisibilityChange,
}: ChatInterfaceProps) => {
  const [inputValue, setInputValue] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [internalHasSubmittedInput, setInternalHasSubmittedInput] =
    useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(
    null,
  );
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Use external state if provided, otherwise use internal state
  const hasSubmittedInput =
    externalHasSubmittedInput !== undefined
      ? externalHasSubmittedInput
      : internalHasSubmittedInput;

  const hasMessages = messages.length > 0;
  const shouldShowStickyInput = hasMessages || hasSubmittedInput || isLoading;

  // Close expanded suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeCategory && 
          suggestionsRef.current && 
          !suggestionsRef.current.contains(event.target as Node)) {
        setActiveCategory(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeCategory]);

  // Dispatch custom event for header when sticky input state changes
  useEffect(() => {
    // Create and dispatch custom event
    const event = new CustomEvent(CHAT_INPUT_STICKY_EVENT, {
      detail: { isSticky: shouldShowStickyInput }
    });
    window.dispatchEvent(event);
  }, [shouldShowStickyInput]);

  // Notify parent about footer visibility when sticky input state changes
  useEffect(() => {
    onFooterVisibilityChange?.(!shouldShowStickyInput);
  }, [shouldShowStickyInput, onFooterVisibilityChange]);

  // Add effect to modify body style when sticky input is shown
  useEffect(() => {
    if (shouldShowStickyInput) {
      // Add padding to body to prevent content from being hidden behind fixed elements
      document.body.style.paddingBottom = "157px"; // Account for input (135px) + footer (22px)
    } else {
      // Reset styles when not showing sticky input
      document.body.style.paddingBottom = "30px"; // Small padding for footer only
    }
    
    // Cleanup function
    return () => {
      document.body.style.paddingBottom = "";
    };
  }, [shouldShowStickyInput]);

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
    <div id="chat-interface-container" className="flex flex-col w-full h-full relative"> 
      {/* Chat messages area - changed from flex-grow to min-h-0 */}
      <div className="min-h-0 overflow-y-auto pb-0">
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
        <div className="w-full max-w-2xl mx-auto px-0 sm:px-4 pt-4 pb-8">
          <div ref={suggestionsRef}>
            <ChatInput
              inputValue={inputValue}
              onInputChange={handleInputChange}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              placeholder={placeholder}
              showExamples={true} // Always show examples initially
              activeCategory={activeCategory}
              onToggleCategory={handleToggleCategory}
              isSticky={false} // This is the non-sticky input
            />
          </div>
        </div>
      )}
      
      {/* Sticky bottom container for input */}
      {shouldShowStickyInput && (
        <div className="fixed bottom-[22px] left-0 right-0 z-[850]"> {/* Reduced space between input and footer */}
          {/* Chat input */}
          <div className="px-0 py-2 sm:p-4 backdrop-blur-xl bg-white/40 dark:bg-gray-900/40 border-t border-gray-200/50 dark:border-gray-700/50 shadow-none transition-all duration-300 ease-in-out">
            <div className="w-full max-w-3xl mx-auto">
              <ChatInput
                inputValue={inputValue}
                onInputChange={handleInputChange}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                placeholder={placeholder}
                showExamples={false} // Do not show examples in sticky mode
                activeCategory={null} // Don't need category state in sticky
                onToggleCategory={() => {}} // No-op toggle in sticky
                isSticky={true} // This is the sticky input
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
