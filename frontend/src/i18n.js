import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Initialize with simple configuration
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "Language": "Language",
          "Home": "Home",
          "Dashboard": "Dashboard",
          "Upload": "Upload",
          "Results": "Results",
          "About": "About",
          "Contact": "Contact",
          "Login": "Login",
          "Signup": "Signup",
          "Logout": "Logout",
          "Profile": "Profile",
          "Settings": "Settings",
          "Welcome": "Welcome to Aqualyx Geo Analyze",
          "Description": "A platform for water quality analysis and visualization"
        }
      },
      hi: {
        translation: {
          "Language": "भाषा",
          "Home": "होम",
          "Dashboard": "डैशबोर्ड",
          "Upload": "अपलोड",
          "Results": "परिणाम",
          "About": "हमारे बारे में",
          "Contact": "संपर्क करें",
          "Login": "लॉगिन",
          "Signup": "साइनअप",
          "Logout": "लॉगआउट",
          "Profile": "प्रोफाइल",
          "Settings": "सेटिंग्स",
          "Welcome": "एक्वालिक्स जियो एनालाइज में आपका स्वागत है",
          "Description": "पानी की गुणवत्ता विश्लेषण और विज़ुअलाइज़ेशन के लिए एक प्लेटफॉर्म"
        }
      },
      bn: {
        translation: {
          "Language": "ভাষা",
          "Home": "হোম",
          "Dashboard": "ড্যাশবোর্ড",
          "Upload": "আপলোড",
          "Results": "ফলাফল",
          "About": "সম্পর্কে",
          "Contact": "যোগাযোগ",
          "Login": "লগইন",
          "Signup": "সাইনআপ",
          "Logout": "লগআউট",
          "Profile": "প্রোফাইল",
          "Settings": "সেটিংস",
          "Welcome": "অ্যাকোয়ালিক্স জিও অ্যানালাইজে স্বাগতম",
          "Description": "জল গুণমান বিশ্লেষণ এবং ভিজ্যুয়ালাইজেশনের জন্য একটি প্ল্যাটফর্ম"
        }
      }
    },
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'userLanguage',
      caches: ['localStorage'],
    }
  });

// Set initial language from localStorage if available
const savedLanguage = localStorage.getItem('userLanguage');
if (savedLanguage) {
  i18n.changeLanguage(savedLanguage);
  document.documentElement.lang = savedLanguage;
  console.log('Language loaded from localStorage:', savedLanguage);
}

export default i18n;
