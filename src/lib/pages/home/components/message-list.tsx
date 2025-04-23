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

  // Scroll to bottom when messages change
  useEffect(() => {
    // Use timeout to ensure DOM updates before scrolling
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 10); // Small delay can help
    return () => clearTimeout(timer);
  }, [messages]); // Trigger effect when messages array changes reference

  if (messages.length === 0) {
    return null; // Don't render anything if no messages
  }

  return (
    <div className="mb-4 p-4 max-w-3xl mx-auto w-full">
      <div className="flex flex-col gap-6">
        {messages.map((message, idx) => (
          <ChatMessageItem
            key={`message-${idx}-${message.role}-${message.content.length}`} // More stable key that changes when content changes
            message={message}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
