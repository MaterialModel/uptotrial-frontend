import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatMessageItemProps {
  message: ChatMessage;
}

export const ChatMessageItem = ({ message }: ChatMessageItemProps) => {
  // Format JSON content if it exists in the message
  const formatContent = (content: string): string => {
    // Check if the content contains JSON data
    const jsonRegex = /\{.*"query_cond":.*\}/s;
    const match = content.match(jsonRegex);
    
    if (match) {
      try {
        // Extract the JSON part
        const jsonStr = match[0];
        // Parse and stringify with formatting
        const formattedJson = JSON.stringify(JSON.parse(jsonStr), null, 2);
        // Replace the original JSON with the formatted version, preserving any text before or after
        return content.replace(jsonStr, '```json\n' + formattedJson + '\n```');
      } catch (e) {
        // If JSON parsing fails, return original content
        console.error('Failed to parse JSON:', e);
        return content;
      }
    }
    
    return content;
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
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a target="_blank" rel="noopener noreferrer" {...props} />
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
