import { Helmet } from 'react-helmet-async';

const APP_NAME = 'UpToTrial';
const SITE_URL = 'https://uptotrial.com';
const DESCRIPTION =
  'Instantly search and filter every ClinicalTrials.gov study. Identify trials that match your patients and download details in one click.';

export const Meta = () => {
  return (
    <Helmet>
      {/* Basic */}
      <title>AI-Powered Clinical Trial Search&nbsp;| {APP_NAME}</title>
      <meta name="description" content={DESCRIPTION} />
      <link rel="canonical" href={SITE_URL} />
      <meta name="robots" content="index,follow" />

      {/* PWA / theming */}
      <meta name="application-name" content={APP_NAME} />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content="#ffffff" />

      {/* Open Graph / Twitter */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={SITE_URL} />
      <meta
        property="og:title"
        content={`AI-Powered Clinical Trial Search | ${APP_NAME}`}
      />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:image" content={`${SITE_URL}/og-cover.png`} />
      <meta name="twitter:card" content="summary_large_image" />

      {/* Icons */}
      <link rel="icon" href="/assets/uptotrial.svg" />
      <link rel="shortcut icon" href="/assets/uptotrial.svg" />

      {/* Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Gantari:wght@400;500;700&family=Open+Sans:wght@300;400;700&display=swap"
        rel="stylesheet"
      />
      <link
        rel="preload"
        href="/fonts/gantari.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
    </Helmet>
  );
};
