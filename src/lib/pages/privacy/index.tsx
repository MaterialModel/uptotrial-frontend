import { Helmet } from 'react-helmet-async';

const Privacy = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <Helmet>
        <title>Privacy Policy | UpToTrial</title>
        <meta
          name="description"
          content="Privacy Policy for UpToTrial - Information about data retention, Google Analytics usage, and contact details."
        />
        <link rel="canonical" href="https://uptotrial.com/privacy" />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Last Updated: 04-28-2025
      </p>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">Data Retention</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Up to Trial retains all data collected through our service. This
            includes, but is not limited to, search queries, user interactions,
            and any information provided through our platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Analytics</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We use Google Analytics 4 to track and analyze the usage of our
            website. Google Analytics 4 collects information such as how often
            users visit our site, what pages they visit, and what other sites
            they used prior to coming to our site. We use the information we get
            from Google Analytics 4 to improve our website and services.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            For more information about how Google collects and processes data
            through Google Analytics, please visit{' '}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              className="underline hover:text-[#008BB0] dark:hover:text-[#44B8D7] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google's Privacy Policy for Partner Sites
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
          <p className="text-gray-700 dark:text-gray-300">
            If you have any questions about our privacy practices or would like
            to request information about the data we hold about you, please
            contact us at{' '}
            <a
              href="mailto:support@uptotrial.com"
              className="underline hover:text-[#008BB0] dark:hover:text-[#44B8D7] transition-colors"
            >
              support@uptotrial.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Changes to This Policy</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We may update our privacy policy from time to time. We will notify
            you of any changes by posting the new privacy policy on this page.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
