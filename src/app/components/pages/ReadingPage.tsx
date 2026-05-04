import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Volume2, VolumeX, Heart, ArrowLeft, Plus, Minus, Moon, Sun } from "lucide-react";
import { getBook, addToFavorites, removeFromFavorites, getFavorites } from "../../lib/api";
import { playClickSound } from "../../lib/sounds";
import { supabase } from "../../lib/supabase";
import { useTheme } from "next-themes";

export default function ReadingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [book, setBook] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSynth(window.speechSynthesis);
    }
  }, []);

  useEffect(() => {
    async function loadBook() {
      try {
        const bookData = await getBook(id!);
        if (bookData?.book) {
          setBook(bookData.book);
        }

        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          const favoritesData = await getFavorites();
          if (favoritesData?.favorites && Array.isArray(favoritesData.favorites)) {
            setIsFavorite(favoritesData.favorites.includes(id) || false);
          }
        }
      } catch (error) {
        console.error('Error loading book:', error);
      }
    }

    loadBook();
  }, [id]);

  const toggleFavorite = async () => {
    playClickSound();

    const { data } = await supabase.auth.getSession();
    if (!data?.session?.user) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await removeFromFavorites(id!);
        setIsFavorite(false);
      } else {
        await addToFavorites(id!);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const toggleReading = () => {
    playClickSound();

    if (!synth || !book) return;

    if (isReading) {
      synth.cancel();
      setIsReading(false);
    } else {
      const newUtterance = new SpeechSynthesisUtterance(book.content);
      newUtterance.lang = 'ta-IN';
      newUtterance.rate = 0.9;
      newUtterance.pitch = 1;

      newUtterance.onend = () => {
        setIsReading(false);
      };

      synth.speak(newUtterance);
      setUtterance(newUtterance);
      setIsReading(true);
    }
  };

  const adjustFontSize = (delta: number) => {
    playClickSound();
    setFontSize(prev => Math.max(12, Math.min(32, prev + delta)));
  };

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">ஏற்றுகிறது...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="sticky top-16 z-40 bg-card/95 backdrop-blur-xl border-b border-border shadow-sm"
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => {
              playClickSound();
              navigate(-1);
            }}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>திரும்பு</span>
          </button>

          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleReading}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                isReading
                  ? 'bg-destructive text-destructive-foreground'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {isReading ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isReading ? 'நிறுத்து' : 'கேளுங்கள்'}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleFavorite}
              className={`p-2 rounded-lg transition-all ${
                isFavorite
                  ? 'bg-destructive text-destructive-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-destructive'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </motion.button>

            <div className="flex items-center space-x-1 bg-secondary rounded-lg p-1">
              <button
                onClick={() => adjustFontSize(-2)}
                className="p-2 hover:bg-accent rounded transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-3 text-sm font-medium">A</span>
              <button
                onClick={() => adjustFontSize(2)}
                className="p-2 hover:bg-accent rounded transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => {
                playClickSound();
                setTheme(theme === 'dark' ? 'light' : 'dark');
              }}
              className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-all"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.div>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 py-12"
      >
        <div className="mb-8">
          <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-md mb-4">
            {book.category}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            {book.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            ஆசிரியர்: {book.author}
          </p>
          {book.description && (
            <p className="text-lg text-muted-foreground italic border-l-4 border-primary pl-4">
              {book.description}
            </p>
          )}
        </div>

        <div
          className="prose prose-lg max-w-none bg-card rounded-2xl p-8 shadow-md border border-border"
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
        >
          {book.content}
        </div>
      </motion.article>
    </div>
  );
}
