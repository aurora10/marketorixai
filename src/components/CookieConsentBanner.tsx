"use client";

import CookieConsent from "react-cookie-consent";
import { useTranslations } from "next-intl";

const CookieConsentBanner = () => {
  const t = useTranslations("CookieConsent");

  return (
    <CookieConsent
      location="bottom"
      buttonText={t("accept")}
      declineButtonText={t("decline")}
      cookieName="CookieConsent"
      style={{
        background: "hsl(240 10% 3.9%)", // dark.background
        color: "hsl(0 0% 98%)", // dark.foreground
        zIndex: 9999,
      }}
      buttonStyle={{
        background: "hsl(217.2 91.2% 59.8%)", // accent.DEFAULT
        color: "hsl(210 40% 98%)", // accent.foreground
        fontSize: "14px",
        fontWeight: "500",
        borderRadius: "6px",
        padding: "10px 24px",
      }}
      declineButtonStyle={{
        background: "transparent",
        color: "hsl(0 0% 98%)", // dark.foreground
        border: "1px solid hsl(217.2 32.6% 17.5%)", // dark.border
        fontSize: "14px",
        fontWeight: "500",
        borderRadius: "6px",
        padding: "10px 24px",
        marginLeft: "10px",
      }}
      enableDeclineButton
      onAccept={() => {
        // The library handles setting the cookie automatically
        // Reloading the page ensures the Analytics script is loaded
        window.location.reload();
      }}
    >
      {t("message")}
    </CookieConsent>
  );
};

export default CookieConsentBanner;
