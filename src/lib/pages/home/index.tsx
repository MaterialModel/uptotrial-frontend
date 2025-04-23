import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChatInterface } from './components/chat-interface';

// API base URL
const API_BASE_URL = 'http://localhost:8000';

// Helper functions for API and correlation ID
const generateCorrelationId = (): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'corr_';
  for (let i = 0; i < 12; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const getCorrelationId = (): string => {
  if (typeof window === 'undefined') {
    return '';
  }

  let correlationId = localStorage.getItem('x-correlation-id');
  if (!correlationId) {
    correlationId = generateCorrelationId();
    localStorage.setItem('x-correlation-id', correlationId);
  }
  return correlationId;
};

// Chat API functions
interface ChatMessage {
  role: string;
  content: string;
}

interface ChatResponse {
  messages: Array<ChatMessage>;
  session_uuid: string;
}

const createNewSession = async (message: string): Promise<ChatResponse> => {
  const correlationId = getCorrelationId();
  const response = await fetch(`${API_BASE_URL}/api/v1/sessions/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Correlation-ID': correlationId,
    },
    body: JSON.stringify({ text: message }),
    mode: 'cors',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
};

const sendMessageToExistingSession = async (
  message: string,
  sessionId: string,
): Promise<ChatResponse> => {
  const correlationId = getCorrelationId();
  const response = await fetch(
    `${API_BASE_URL}/api/v1/sessions/chat/${sessionId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'correlation-id': correlationId,
      },
      body: JSON.stringify({ text: message }),
      mode: 'cors',
      credentials: 'include',
    },
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
};

const getExistingSession = async (sessionId: string): Promise<ChatResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/sessions/chat/${sessionId}`,
    {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    },
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
};

const Home = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionIdFromUrl = searchParams.get('session_uuid');

  const [sessionId, setSessionId] = useState<string | null>(sessionIdFromUrl);
  const [messages, setMessages] = useState<Array<ChatMessage>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSubmittedInput, setHasSubmittedInput] = useState(false);

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

      let chatResponse: ChatResponse;

      if (!sessionId) {
        // Create a new session if we don't have one
        chatResponse = await createNewSession(message);
        setSessionId(chatResponse.session_uuid);

        // Update URL with session ID for future deep linking
        navigate(`/?session_uuid=${chatResponse.session_uuid}`, {
          replace: true,
        });
      } else {
        // Send message to existing session
        chatResponse = await sendMessageToExistingSession(message, sessionId);
      }

      // Update messages with the full response from the server
      setMessages(chatResponse.messages);
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for when the first input is submitted
  const handleInputSubmitted = () => {
    setHasSubmittedInput(true);
  };

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
          messages={messages}
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
