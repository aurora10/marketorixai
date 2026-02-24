import Header from "@/components/Header";
import InteractiveScrollToTop from "@/components/InteractiveScrollToTop";
import MotionServiceCardService from "@/components/MotionServiceCardService";
import Call from "@/components/Call";
import WhatWeDo from "@/components/WhatWeDo";
import { getTranslations } from 'next-intl/server';

export default async function ServicesPage() {
  const t = await getTranslations("ServicesPage");
  const tGeneral = await getTranslations();

  const services = [
    {
      title: t("items.code_review.title"),
      description: t("items.code_review.description"),
      features: t.raw("items.code_review.features"),
    },
    {
      title: t("items.recovery.title"),
      description: t("items.recovery.description"),
      features: t.raw("items.recovery.features"),
    },
    {
      title: t("items.autonomous_dev.title"),
      description: t("items.autonomous_dev.description"),
      features: t.raw("items.autonomous_dev.features"),
    },
    {
      title: t("items.chatbot_dev.title"),
      description: t("items.chatbot_dev.description"),
      features: t.raw("items.chatbot_dev.features"),
    },
    {
      title: t("items.integration.title"),
      description: t("items.integration.description"),
      features: t.raw("items.integration.features"),
    },
    {
      title: t("items.strategy.title"),
      description: t("items.strategy.description"),
      features: t.raw("items.strategy.features"),
    },
    {
      title: t("items.custom_dev.title"),
      description: t("items.custom_dev.description"),
      features: t.raw("items.custom_dev.features"),
    },
    {
      title: t("items.support.title"),
      description: t("items.support.description"),
      features: t.raw("items.support.features"),
    },
    {
      title: t("items.industry_apps.title"),
      description: t("items.industry_apps.description"),
      features: t.raw("items.industry_apps.features"),
    },
    {
      title: t("items.nl_to_sql.title"),
      description: t("items.nl_to_sql.description"),
      features: t.raw("items.nl_to_sql.features"),
    },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": services.map(service => ({
      "@type": "Service",
      "name": service.title,
      "description": service.description
    }))
  };

  return (
    <div className="relative text-white min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Header />

      <section id="services" className="container mx-auto px-4 py-20 mb-8">
        <WhatWeDo />

        {/* Ensure grid layout is applied correctly */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <MotionServiceCardService
              key={service.title}
              service={service}
              index={index}
            />
          ))}
        </div>

        <Call />
      </section>

      <footer className="py-8">
        <div className="container mx-auto px-4 text-center">
          <p>{tGeneral("Footer.copyright2023")}</p>
        </div>
      </footer>

      <InteractiveScrollToTop />
    </div>
  );
}
