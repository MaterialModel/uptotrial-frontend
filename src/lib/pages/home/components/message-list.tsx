import { useEffect, useRef } from 'react';
import { ChatMessageItem } from './chat-message-item'; // Adjust path if needed

interface ChatMessage {
  role: string;
  content: string;
}

interface MessageListProps {
  messages: Array<ChatMessage>;
}

export const MessageList = ({ messages }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Custom scroll logic - only scroll when content is at least halfway down the page
  useEffect(() => {
    if (messages.length === 0) {
      return;
    }

    const checkScrollPosition = () => {
      if (!messagesEndRef.current) {
        return;
      }

      // Get viewport dimensions
      const viewportHeight = window.innerHeight;

      // Get position of the end marker
      const rect = messagesEndRef.current.getBoundingClientRect();

      // Only scroll if end marker is below the halfway point of the viewport
      // (rect.top > viewportHeight / 2) means it's in the bottom half of the screen or lower
      if (rect.top > viewportHeight / 2) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

    // Small delay to ensure DOM updates
    const timer = setTimeout(checkScrollPosition, 50);
    return () => clearTimeout(timer);
  }, [messages]);

  if (messages.length === 0) {
    return null; // Don't render anything if no messages
  }

  return (
    <div className="mb-4 p-4 max-w-3xl mx-auto w-full">
      <div className="flex flex-col gap-6">
        {messages.map((message, idx) => (
          <ChatMessageItem
            key={`message-${idx}-${message.role}`}
            message={message}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
