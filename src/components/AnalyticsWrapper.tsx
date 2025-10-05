'use client';

import { getCookieConsentValue } from 'react-cookie-consent';
import { useEffect, useState } from 'react';
import GoogleAnalytics from './GoogleAnalytics';

// This component is needed to perform a client-side check for the cookie.
const AnalyticsWrapper = ({ gaId }: { gaId: string | undefined }) => {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const consent = getCookieConsentValue('CookieConsent');
    setHasConsent(consent === 'true');
  }, []);

  if (!gaId) {
    return null;
  }

  return <>{hasConsent && <GoogleAnalytics GA_MEASUREMENT_ID={gaId} />}</>;
};

export default AnalyticsWrapper;
