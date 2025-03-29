// utils/languages.ts
export const translations = {
    en: {
      title: "HealCure",
      subtitle: "AI-Powered Rural Healthcare",
      getStarted: "Get Started",
      ivrMode: "IVR Mode (Coming Soon)"
    },
    hi: {
      title: "हीलक्योर",
      subtitle: "एआई-संचालित ग्रामीण स्वास्थ्य सेवा",
      getStarted: "शुरू करें",
      ivrMode: "आईवीआर मोड (जल्द आ रहा है)"
    }
  };
  
  export type LanguageCode = keyof typeof translations;