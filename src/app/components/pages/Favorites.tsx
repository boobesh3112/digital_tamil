import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Heart, BookOpen } from "lucide-react";
import { getFavorites, getBooks } from "../../lib/api";
import { supabase } from "../../lib/supabase";
import BookCard from "../BookCard";

export default function Favorites() {
  const navigate = useNavigate();
  const [favoriteBooks, setFavoriteBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function loadFavorites() {
      const { data } = await supabase.auth.getSession();

      if (!data?.session?.user) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);

      try {
        const favoritesData = await getFavorites();
        const booksData = await getBooks();

        if (favoritesData?.favorites && Array.isArray(favoritesData.favorites) &&
            booksData?.books && Array.isArray(booksData.books)) {
          const favBooks = booksData.books.filter((book: any) =>
            favoritesData.favorites.includes(book.id)
          );
          setFavoriteBooks(favBooks);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }

      setLoading(false);
    }

    loadFavorites();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">ஏற்றுகிறது...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full mb-6">
            <Heart className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            பிடித்தவை பார்க்க உள்நுழையுங்கள்
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            உங்கள் பிடித்த புத்தகங்களைச் சேமிக்க கணக்கு தேவை
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg font-medium"
          >
            உள்நுழை
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-2">
            <Heart className="w-8 h-8 text-destructive fill-current" />
            <h1 className="text-4xl font-bold text-foreground">பிடித்த புத்தகங்கள்</h1>
          </div>
          <p className="text-muted-foreground">
            {favoriteBooks.length > 0
              ? `${favoriteBooks.length} புத்தகங்கள் சேமிக்கப்பட்டன`
              : 'இன்னும் பிடித்த புத்தகங்கள் இல்லை'
            }
          </p>
        </motion.div>

        {favoriteBooks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-muted rounded-full mb-6">
              <BookOpen className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              பிடித்த புத்தகங்கள் இல்லை
            </h2>
            <p className="text-muted-foreground mb-8">
              புத்தகங்களைப் படித்து ❤️ ஐக் கிளிக் செய்து சேமியுங்கள்
            </p>
            <button
              onClick={() => navigate('/books')}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg font-medium"
            >
              புத்தகங்களை ஆராயுங்கள்
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BookCard book={book} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
