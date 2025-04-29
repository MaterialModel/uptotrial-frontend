export const Footer = () => {
  return (
    <footer className="fixed bottom-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-1 z-[950] text-center">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Up to Trial &copy; {new Date().getFullYear()} Built in San Francisco.{' '}
        <a
          href="mailto:hi@uptotrial.com"
          className="underline hover:text-[#008BB0] dark:hover:text-[#44B8D7] transition-colors"
        >
          Contact
        </a>{' '}
        |{' '}
        <a
          href="/privacy"
          className="underline hover:text-[#008BB0] dark:hover:text-[#44B8D7] transition-colors"
        >
          Privacy Policy
        </a>
      </p>
    </footer>
  );
};
