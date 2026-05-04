import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { addToFavorites, removeFromFavorites, getFavorites } from "../lib/api";
import { playClickSound } from "../lib/sounds";
import { supabase } from "../lib/supabase";

interface BookCardProps {
  book: {
    id: string;
    title: string;
    author: string;
    cover: string;
    category: string;
    description?: string;
  };
}

export default function BookCard({ book }: BookCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data?.session?.user);

        if (data?.session?.user) {
          const favoritesData = await getFavorites();
          if (favoritesData?.favorites && Array.isArray(favoritesData.favorites)) {
            setIsFavorite(favoritesData.favorites.includes(book.id) || false);
          }
        }
      } catch (error) {
        console.error('Error checking favorites:', error);
      }
    }

    checkAuth();
  }, [book.id]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    playClickSound();

    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    try {
      if (isFavorite) {
        await removeFromFavorites(book.id);
        setIsFavorite(false);
      } else {
        await addToFavorites(book.id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group"
    >
      <Link to={`/books/${book.id}`} onClick={playClickSound}>
        <div className="relative bg-card rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-border">
          <div className="aspect-[3/4] overflow-hidden bg-muted">
            <img
              src={book.cover}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          <div className="absolute top-2 right-2 z-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleFavorite}
              className={`p-2 rounded-full backdrop-blur-md shadow-lg transition-all duration-200 ${
                isFavorite
                  ? 'bg-destructive text-destructive-foreground'
                  : 'bg-card/80 text-muted-foreground hover:text-destructive'
              }`}
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`}
              />
            </motion.button>
          </div>

          <div className="p-4 bg-gradient-to-t from-card via-card to-transparent">
            <div className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-md mb-2">
              {book.category}
            </div>
            <h3 className="font-bold text-lg text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
              {book.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
            {book.description && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                {book.description}
              </p>
            )}

            <motion.div
              initial={{ width: 0 }}
              whileHover={{ width: '100%' }}
              className="h-1 bg-gradient-to-r from-primary to-accent rounded-full mt-3"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
