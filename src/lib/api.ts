// API base URL
const API_BASE_URL =
  typeof process.env.VITE_API_URL === 'string' &&
  process.env.VITE_API_URL !== 'undefined'
    ? process.env.VITE_API_URL
    : 'http://localhost:8000';

// Regex for extracting key-value pairs from events
const eventRegex = /<event>([\s\S]*?)<\/event>/g;
const keyMatchRegex = /<key>(.*?)<\/key>/s;
const valueMatchRegex = /<value>([\s\S]*?)<\/value>/s;

// Types and interfaces
export interface ChatMessage {
  role: string;
  content: string;
}

export interface ChatResponse {
  messages: Array<ChatMessage>;
  session_uuid: string;
}

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

export const getCorrelationId = (): string => {
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

export const parseChunk = (
  chunk: string,
): Array<{ key: string; value: string }> => {
  const results: Array<{ key: string; value: string }> = [];

  // Find all event tags in the chunk
  const events = [...chunk.matchAll(eventRegex)];

  for (const event of events) {
    const eventContent = event[1];

    const keyMatch = eventContent.match(keyMatchRegex);
    const valueMatch = eventContent.match(valueMatchRegex);

    if (keyMatch && valueMatch) {
      const key = keyMatch[1];
      const value = valueMatch[1];

      results.push({ key, value });
    }
  }

  return results;
};

export const handleStreamingResponse = async (
  response: Response,
  setCurrentAssistantMessage: (message: string) => void,
): Promise<string> => {
  // Handle streaming response
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let sessionUuid = '';
  let buffer = '';

  if (!reader) {
    throw new Error('Response body is null');
  }

  let doneReading = false;
  while (!doneReading) {
    const { value, done } = await reader.read();
    doneReading = done;

    if (value) {
      // Append the new chunk to any buffered data
      const parsedChunks = parseChunk(decoder.decode(value, { stream: !done }));
      for (const parsedChunk of parsedChunks) {
        if (parsedChunk.key === 'session_uuid') {
          sessionUuid = parsedChunk.value;
        } else if (parsedChunk.key === 'data') {
          buffer += parsedChunk.value;
          setCurrentAssistantMessage(buffer);
        }
      }
    }
  }

  return sessionUuid;
};

// Create a new session using streaming endpoint
export const createNewSession = async (
  message: string,
  setCurrentAssistantMessage: (message: string) => void,
): Promise<string> => {
  const correlationId = getCorrelationId();

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/sessions/streaming/new`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Correlation-ID': correlationId,
        },
        body: JSON.stringify({ text: message }),
        mode: 'cors',
        credentials: 'include',
      },
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await handleStreamingResponse(response, setCurrentAssistantMessage);
  } catch (error) {
    console.error('Error in createNewSession:', error);
    throw error;
  }
};

// Send message to existing session using streaming endpoint
export const sendMessageToExistingSession = async (
  message: string,
  sessionId: string,
  setCurrentAssistantMessage: (message: string) => void,
): Promise<void> => {
  const correlationId = getCorrelationId();

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/sessions/streaming/${sessionId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Correlation-ID': correlationId,
        },
        body: JSON.stringify({ text: message }),
        mode: 'cors',
        credentials: 'include',
      },
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    await handleStreamingResponse(response, setCurrentAssistantMessage);
  } catch (error) {
    console.error('Error in sendMessageToExistingSession:', error);
    throw error;
  }
};

export const getExistingSession = async (
  sessionId: string,
): Promise<ChatResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/sessions/${sessionId}`, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
};
