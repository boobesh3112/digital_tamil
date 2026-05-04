import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { playClickSound } from '../lib/sounds';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    playClickSound();
    setLanguage(language === 'ta' ? 'en' : 'ta');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-card border border-border hover:bg-accent/10 transition-all"
      aria-label="Toggle language"
    >
      <Globe className="w-5 h-5 text-muted-foreground" />
      <span className="text-sm font-medium text-foreground">
        {language === 'ta' ? 'EN' : 'த'}
      </span>
    </button>
  );
}
