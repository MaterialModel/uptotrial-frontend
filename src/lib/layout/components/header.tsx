import { ThemeToggle } from '@/lib/components/theme-toggle';
import { useEffect, useState } from 'react';

// Define custom event name
const CHAT_INPUT_STICKY_EVENT = 'chatInputStickyChange';

// Add this to the global window object
declare global {
  interface WindowEventMap {
    [CHAT_INPUT_STICKY_EVENT]: CustomEvent<{ isSticky: boolean }>;
  }
}

export const Header = () => {
  const [shouldShowLogo, setShouldShowLogo] = useState(false);

  useEffect(() => {
    // Function to handle the custom event
    const handleChatInputStickyChange = (
      e: CustomEvent<{ isSticky: boolean }>,
    ) => {
      setShouldShowLogo(e.detail.isSticky);
    };

    // Add event listener for the custom event
    window.addEventListener(
      CHAT_INPUT_STICKY_EVENT,
      handleChatInputStickyChange as EventListener,
    );

    // Also check on initial load if we're not on the homepage
    const path = window.location.pathname;
    const isHomepage = path === '/' || path === '';
    if (!isHomepage) {
      setShouldShowLogo(true);
    }

    // Cleanup
    return () => {
      window.removeEventListener(
        CHAT_INPUT_STICKY_EVENT,
        handleChatInputStickyChange as EventListener,
      );
    };
  }, []);

  return (
    <header className="bg-white/60 dark:bg-gray-900/60 fixed top-0 z-10 w-full border-b border-gray-200 dark:border-gray-800 backdrop-blur-md">
      <section className="wrapper mx-auto flex items-center justify-between py-2">
        <div className="flex items-center">
          {shouldShowLogo && (
            <a href="/" className="flex items-center">
              <img
                src="/assets/uptotrial.svg"
                alt="UpToTrial Logo"
                className="h-8 w-auto mr-3"
              />
              <h1 className="text-xl font-bold">
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
            </a>
          )}
        </div>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </section>
    </header>
  );
};
