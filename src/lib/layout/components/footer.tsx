export const Footer = () => {
  return (
    <footer className="wrapper">
      <div className="flex items-center justify-between">
        <p className="text-xs">
          &copy; {new Date().getFullYear()}. Built in San Francisco. Ideated in
          Boston.
        </p>
        <span>&nbsp;</span>
        <a
          href="mailto:william_shen@hms.harvard.edu"
          className="text-xs underline hover:text-[#008BB0] dark:hover:text-[#44B8D7] transition-colors"
        >
          Contact
        </a>
      </div>
    </footer>
  );
};
