import { Helmet } from 'react-helmet-async';

const APP_NAME = 'UpToTrial';

export const Meta = () => {
  return (
    <Helmet>
      <title>UpToTrial</title>
      <meta
        name="description"
        content="AI-powered search for clinical trials"
      />

      <meta name="application-name" content={APP_NAME} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={APP_NAME} />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content="#FFFFFF" />

      <link rel="shortcut icon" href="/assets/uptotrail.svg" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Gantari:wght@400;500;600;700&family=Open+Sans:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </Helmet>
  );
};
