import { XMLRenderer } from './xml-renderer';

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatMessageItemProps {
  message: ChatMessage;
}

export const ChatMessageItem = ({ message }: ChatMessageItemProps) => {
  // Check if the content is XML conforming to our schema
  const isXmlContent = (content: string): boolean => {
    return content.trim().startsWith('<?xml') || content.trim().startsWith('<response');
  };

  return (
    <div
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start w-full'}`}
    >
      <div
        className={`${
          message.role === 'user'
            ? 'max-w-full bg-gray-50 text-gray-800 border border-[#44B8D7] dark:bg-[#0f3a47]'
            : 'w-full text-gray-800 dark:text-gray-200'
        } ${message.role === 'user' ? 'rounded-lg px-3 py-2' : 'rounded-3xl p-3'} backdrop-blur-sm transform transition-all duration-300 ease-in-out`}
      >
        <div
          className={`prose dark:prose-invert prose-sm sm:prose-base ${message.role !== 'user' ? 'max-w-none' : 'font-semibold'} transition-all duration-300`}
        >
          {isXmlContent(message.content) ? (
            <XMLRenderer content={message.content} />
          ) : (
            <div className="whitespace-pre-wrap">{message.content}</div>
          )}
        </div>
      </div>
    </div>
  );
};
