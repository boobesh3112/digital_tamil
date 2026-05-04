import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ta' | 'en';

interface Translations {
  [key: string]: string;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Translations> = {
  ta: {
    // Navigation
    home: 'முகப்பு',
    books: 'புத்தகங்கள்',
    classical: 'திருக்குறள்',
    favorites: 'பிடித்தவை',
    login: 'உள்நுழை',
    signup: 'பதிவு செய்க',
    logout: 'வெளியேறு',

    // Auth
    email: 'மின்னஞ்சல்',
    password: 'கடவுச்சொல்',
    name: 'பெயர்',
    confirmPassword: 'கடவுச்சொல் உறுதிப்படுத்தல்',
    loginButton: 'உள்நுழை',
    signupButton: 'பதிவு செய்க',
    loginToAccount: 'உங்கள் கணக்கில் உள்நுழையுங்கள்',
    createAccount: 'புதிய கணக்கை உருவாக்குங்கள்',
    newUser: 'புதிய பயனர்?',
    existingUser: 'ஏற்கனவே கணக்கு உள்ளதா?',
    yourName: 'உங்கள் பெயர்',

    // Errors
    emailRequired: 'மின்னஞ்சல் முகவரியை உள்ளிடவும்',
    passwordRequired: 'கடவுச்சொல்லை உள்ளிடவும்',
    nameRequired: 'பெயரை உள்ளிடவும்',
    invalidCredentials: 'தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்',
    emailNotConfirmed: 'மின்னஞ்சல் உறுதிப்படுத்தப்படவில்லை',
    loginFailed: 'உள்நுழைவு தோல்வி. மீண்டும் முயற்சிக்கவும்',
    emailExists: 'இந்த மின்னஞ்சல் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது',
    passwordTooShort: 'கடவுச்சொல் குறைந்தது 6 எழுத்துக்கள் இருக்க வேண்டும்',
    passwordMismatch: 'கடவுச்சொற்கள் பொருந்தவில்லை',
    invalidEmail: 'சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்',
    signupFailed: 'பதிவு தோல்வி. மீண்டும் முயற்சிக்கவும்',

    // Success
    signupSuccess: 'பதிவு வெற்றிகரமாக நிறைவடைந்தது!',

    // Password Strength
    weak: 'பலவீனமான',
    medium: 'நடுத்தரமான',
    good: 'நல்ல',
    strong: 'வலுவான',

    // Common
    search: 'தேடுக',
    category: 'வகை',
    author: 'ஆசிரியர்',
    readMore: 'மேலும் வாசிக்க',
    allCategories: 'அனைத்து வகைகள்',
  },
  en: {
    // Navigation
    home: 'Home',
    books: 'Books',
    classical: 'Thirukkural',
    favorites: 'Favorites',
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',

    // Auth
    email: 'Email',
    password: 'Password',
    name: 'Name',
    confirmPassword: 'Confirm Password',
    loginButton: 'Login',
    signupButton: 'Sign Up',
    loginToAccount: 'Login to your account',
    createAccount: 'Create a new account',
    newUser: 'New user?',
    existingUser: 'Already have an account?',
    yourName: 'Your name',

    // Errors
    emailRequired: 'Please enter your email address',
    passwordRequired: 'Please enter your password',
    nameRequired: 'Please enter your name',
    invalidCredentials: 'Invalid email or password',
    emailNotConfirmed: 'Email not confirmed',
    loginFailed: 'Login failed. Please try again',
    emailExists: 'This email is already registered',
    passwordTooShort: 'Password must be at least 6 characters',
    passwordMismatch: 'Passwords do not match',
    invalidEmail: 'Please enter a valid email address',
    signupFailed: 'Signup failed. Please try again',

    // Success
    signupSuccess: 'Signup successful!',

    // Password Strength
    weak: 'Weak',
    medium: 'Medium',
    good: 'Good',
    strong: 'Strong',

    // Common
    search: 'Search',
    category: 'Category',
    author: 'Author',
    readMore: 'Read More',
    allCategories: 'All Categories',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('language');
    return (stored === 'en' || stored === 'ta') ? stored : 'ta';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language === 'ta' ? 'ta' : 'en';
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
