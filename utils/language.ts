// utils/languages.ts
import { useState } from 'react';

export const translations = {
    en: {
      // Landing Page
      title: "HealCure",
      subtitle: "AI-Powered Rural Healthcare",
      getStarted: "Get Started",
      ivrMode: "IVR Mode (Coming Soon)",
      
      // Home Page
      home_title: "Health Assistant",
      chat_welcome: "Hello! I'm your HealCure assistant. How are you feeling today? I can help with common symptoms and health questions.",
      chat_placeholder: "Describe your symptoms...",
      chat_response: "Based on the symptoms you've described, I recommend rest and hydration. If symptoms persist for more than 48 hours, please consult a healthcare provider. Is there anything else you'd like to know?",
      fever: "Fever",
      cough: "Cough",
      headache: "Headache",
      
      // New translations
      checkup: "Health Check",
      medication: "Medications",
      nearby: "Find Clinic",
      emergency: "Emergency",
      speak_to_doctor: "Speak to Doctor",
      health_tips: "Health Tips",
      
      // Detection Screen
      permission_denied: "Permission to access media was denied",
      gallery: "Gallery",
      camera: "Camera",
      analyze: "Analyze Image",
      analyzing: "Analyzing",
      detection_title: "Symptom Detection",

      //Map Page
      clinic: "Clinic",
      hospital: "Hospital",
      pharmacy: "Pharmacy",
      your_location: "Your Location",
      loading: "Loading map",
      permission_deniedMap: "Location permission denied",
    },
    hi: {
      // Landing Page
      title: "हीलक्योर",
      subtitle: "एआई-संचालित ग्रामीण स्वास्थ्य सेवा",
      getStarted: "शुरू करें",
      ivrMode: "आईवीआर मोड (जल्द आ रहा है)",
      
      // Home Page
      home_title: "स्वास्थ्य सहायक",
      chat_welcome: "नमस्ते! मैं आपका हीलक्योर सहायक हूँ। आज आप कैसा महसूस कर रहे हैं? मैं सामान्य लक्षणों और स्वास्थ्य प्रश्नों में मदद कर सकता हूँ।",
      chat_placeholder: "अपने लक्षण बताएं...",
      chat_response: "आपके बताए गए लक्षणों के आधार पर, मैं आराम और पानी पीने की सलाह देता हूँ। यदि लक्षण 48 घंटे से अधिक समय तक बने रहते हैं, तो कृपया किसी स्वास्थ्य सेवा प्रदाता से परामर्श करें। क्या आप कुछ और जानना चाहेंगे?",
      fever: "बुखार",
      cough: "खांसी",
      headache: "सिरदर्द",
      
      // New translations
      checkup: "स्वास्थ्य जांच",
      medication: "दवाइयां",
      nearby: "क्लिनिक खोजें",
      emergency: "आपातकाल",
      speak_to_doctor: "डॉक्टर से बात करें",
      health_tips: "स्वास्थ्य टिप्स",
      
      // Detection Screen
      permission_denied: "मीडिया तक पहुंच की अनुमति अस्वीकृत",
      gallery: "गैलरी",
      camera: "कैमरा",
      analyze: "छवि विश्लेषण",
      analyzing: "विश्लेषण हो रहा है",
      detection_title: "लक्षण जांच",

      clinic: "क्लिनिक",
      hospital: "अस्पताल",
      pharmacy: "दवाई की दुकान",
      your_location: "आपका स्थान",
      loading: "मानचित्र लोड हो रहा है",
      permission_deniedMap: "स्थान अनुमति अस्वीकृत"
    }
};

export type LanguageCode = keyof typeof translations;

// Helper hook for translations
export const useTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');

  const t = (key: keyof typeof translations['en']) => {
    return translations[currentLanguage][key] || key;
  };

  const toggleLanguage = () => {
    setCurrentLanguage(currentLanguage === 'en' ? 'hi' : 'en');
  };

  return { t, toggleLanguage, currentLanguage };
};

export type TranslationKey = keyof typeof translations['en'];