import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  type ChatMessage,
  createNewSession,
  getExistingSession,
  sendMessageToExistingSession,
} from '../../api';
import { ChatInterface } from './components/chat-interface';

const Home = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionIdFromUrl = searchParams.get('session_uuid');

  const [sessionId, setSessionId] = useState<string | null>(sessionIdFromUrl);
  const [messages, setMessages] = useState<Array<ChatMessage>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSubmittedInput, setHasSubmittedInput] = useState(false);
  const [currentAssistantMessage, setCurrentAssistantMessage] =
    useState<string>('');

  // Set hasSubmittedInput to true if we have a session UUID in the URL
  useEffect(() => {
    if (sessionIdFromUrl) {
      setHasSubmittedInput(true);
    }
  }, [sessionIdFromUrl]);

  // Load session from URL parameter if present
  useEffect(() => {
    const fetchSessionIfNeeded = async () => {
      if (sessionIdFromUrl) {
        try {
          setIsLoading(true);
          const chatData = await getExistingSession(sessionIdFromUrl);
          setSessionId(chatData.session_uuid);
          setMessages(chatData.messages);
        } catch (err) {
          setError('Failed to load existing session');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSessionIfNeeded();
  }, [sessionIdFromUrl]);

  // Handle sending a new message
  const handleSendMessage = async (message: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Add user message to the UI immediately
      const userMessage: ChatMessage = { role: 'user', content: message };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      if (!sessionId) {
        // Create a new session using streaming endpoint
        const newSessionId = await createNewSession(
          message,
          setCurrentAssistantMessage,
        );
        setSessionId(newSessionId);

        // Update URL with session ID for future deep linking
        navigate(`/?session_uuid=${newSessionId}`, {
          replace: true,
        });
      } else {
        // Send message to existing session using streaming endpoint
        await sendMessageToExistingSession(
          message,
          sessionId,
          setCurrentAssistantMessage,
        );
      }
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
    } finally {
      // Small delay before setting isLoading to false
      // This ensures the UI has time to render the final streamed response
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
  };

  // Update messages when streaming response completes
  useEffect(() => {
    if (!isLoading && currentAssistantMessage) {
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: currentAssistantMessage,
      };
      setMessages((prevMessages) => {
        // Filter out any incomplete assistant message
        const filteredMessages = prevMessages.filter(
          (msg) => !(msg.role === 'assistant' && msg.content === ''),
        );
        return [...filteredMessages, assistantMessage];
      });
      setCurrentAssistantMessage('');
    }
  }, [isLoading, currentAssistantMessage]);

  // Handler for when the first input is submitted
  const handleInputSubmitted = () => {
    setHasSubmittedInput(true);
  };

  // Show the current streaming message while loading
  const displayMessages = [...messages];
  if (isLoading && currentAssistantMessage) {
    displayMessages.push({
      role: 'assistant',
      content: currentAssistantMessage,
    });
  } else if (currentAssistantMessage && !isLoading) {
    // Add the completed message to display while it's being added to state
    // This prevents the flash between streaming completion and state update
    displayMessages.push({
      role: 'assistant',
      content: currentAssistantMessage,
    });
  }

  return (
    <div className="flex flex-col items-center gap-8 py-12 sm:px-4 md:px-8 lg:px-12">
      {hasSubmittedInput ? (
        // Compact header with just logo and title
        <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 py-3 px-4 transition-all duration-300">
          <div className="max-w-3xl mx-auto flex items-center">
            <img
              src="/assets/uptotrail.svg"
              alt="UpToTrial Logo"
              className="h-8 w-auto mr-3"
            />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              <span
                className="text-black dark:text-white tracking-tight"
                style={{
                  fontFamily:
                    "'Gantari', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                }}
              >
                UpToTrial
              </span>
            </h1>
          </div>
        </div>
      ) : (
        // Full title and logo for initial page
        <div className="mb-2 text-center">
          <img
            src="/assets/uptotrail.svg"
            alt="UpToTrial Logo"
            className="mx-auto mb-4 h-24 w-auto"
          />
          <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
            <span
              className="text-black dark:text-white tracking-tight"
              style={{
                fontFamily:
                  "'Gantari', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                fontWeight: 500,
                letterSpacing: '0.02em',
              }}
            >
              UpToTrial
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Searching clinicaltrials.gov just got a whole lot easier
          </p>
        </div>
      )}

      {/* Add top padding when header is fixed */}
      {hasSubmittedInput && <div className="h-16" />}

      <div className="w-full min-w-[320px] md:min-w-[640px] lg:min-w-[768px] max-w-6xl">
        <ChatInterface
          messages={displayMessages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          error={error}
          hasSubmittedInput={hasSubmittedInput}
          onInputSubmitted={handleInputSubmitted}
        />
      </div>
    </div>
  );
};

export default Home;
