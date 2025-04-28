import { useState } from 'react';
import { xmlRegistry } from './xml-registry';
import { XMLRenderer } from './xml-renderer/renderer';

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatMessageItemProps {
  message: ChatMessage;
}

export const ChatMessageItem = ({ message }: ChatMessageItemProps) => {
  const [showRawDialog, setShowRawDialog] = useState(false);

  // Check if the content is XML conforming to our schema
  const isXmlContent = (content: string): boolean => {
    return (
      content.trim().startsWith('<?xml') ||
      content.trim().startsWith('<response')
    );
  };

  // Check if content is an empty response
  const isEmptyResponse = (content: string): boolean => {
    return (
      message.role !== 'user' &&
      content.includes('<response>') &&
      content.replace(/<\/?response>/g, '').trim() === ''
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' || e.key === 'Enter') {
      setShowRawDialog(false);
    }
  };

  const handlePropagationKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
  };

  return (
    <>
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
            {isEmptyResponse(message.content) ? (
              <div className="border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/30 p-4 rounded-r-md animate-pulse">
                <p className="text-amber-800 dark:text-amber-200 font-medium">
                  Our agents are currently busy... working for you
                </p>
              </div>
            ) : isXmlContent(message.content) ? (
              <XMLRenderer content={message.content} registry={xmlRegistry} />
            ) : (
              <div className="whitespace-pre-wrap">{message.content}</div>
            )}
          </div>

          {message.role !== 'user' && (
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowRawDialog(true)}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center gap-1 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-labelledby="codeIcon"
                  role="img"
                >
                  <title id="codeIcon">View code</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
                see raw output
              </button>
            </div>
          )}
        </div>
      </div>

      {showRawDialog && (
        <div
          className="fixed inset-0 bg-black/20 flex items-center justify-center z-[9999]"
          onClick={() => setShowRawDialog(false)}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby="rawOutputTitle"
        >
          <div
            className="bg-white/95 dark:bg-gray-800/95 rounded-lg p-4 max-w-3xl max-h-[80vh] overflow-auto w-[90%] m-4 shadow-xl border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handlePropagationKeyDown}
          >
            <div className="flex justify-between items-center mb-4">
              <h3
                id="rawOutputTitle"
                className="text-lg font-medium dark:text-white"
              >
                Raw Output
              </h3>
              <button
                type="button"
                onClick={() => setShowRawDialog(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-labelledby="closeIcon"
                  role="img"
                >
                  <title id="closeIcon">Close dialog</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto text-sm whitespace-pre-wrap max-h-[60vh]">
              {message.content}
            </pre>
          </div>
        </div>
      )}
    </>
  );
};
