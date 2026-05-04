import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Search, BookOpen, Heart, History, FileText, Sparkles } from "lucide-react";
import { getBooks, getRandomQuote } from "../../lib/api";
import { playClickSound } from "../../lib/sounds";
import BookCard from "../BookCard";
import DeploymentNotice from "../DeploymentNotice";

export default function Home() {
  const [quote, setQuote] = useState<any>(null);
  const [featuredBooks, setFeaturedBooks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeploymentNotice, setShowDeploymentNotice] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const quoteData = await getRandomQuote();
        if (quoteData?.quote) {
          setQuote(quoteData.quote);
          setShowDeploymentNotice(false);
        } else {
          setShowDeploymentNotice(true);
        }

        const booksData = await getBooks();
        if (booksData?.books && Array.isArray(booksData.books)) {
          setFeaturedBooks(booksData.books.slice(0, 6));
          setShowDeploymentNotice(false);
        } else {
          setShowDeploymentNotice(true);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setShowDeploymentNotice(true);
      }
    }

    loadData();
  }, []);

  const categories = [
    { name: "நாவல்கள்", icon: BookOpen, color: "from-primary to-primary/70", path: "/books?category=நாவல்கள்" },
    { name: "கவிதைகள்", icon: Sparkles, color: "from-accent to-accent/70", path: "/books?category=கவிதைகள்" },
    { name: "வரலாறு", icon: History, color: "from-chart-3 to-chart-3/70", path: "/books?category=வரலாறு" },
    { name: "சிறுகதைகள்", icon: FileText, color: "from-chart-4 to-chart-4/70", path: "/books?category=சிறுகதைகள்" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      playClickSound();
      window.location.href = `/books?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen">
      {showDeploymentNotice && (
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <DeploymentNotice />
        </div>
      )}

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent py-20 px-4"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-accent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-foreground rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary-foreground mb-4">
              தமிழ் இலக்கிய உலகத்தை ஆராயுங்கள்
            </h1>
            <p className="text-lg sm:text-xl text-primary-foreground/90 mb-8">
              தமிழ் இலக்கியத்தை டிஜிட்டல் வடிவில் பாதுகாத்து, அனைவருக்கும் அணுகல் வழங்குகிறோம்
            </p>
          </motion.div>

          <motion.form
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="புத்தகத்தை தேடுங்கள்..."
                className="w-full px-6 py-4 pr-14 rounded-full bg-white text-foreground shadow-2xl focus:ring-4 focus:ring-accent focus:outline-none text-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </motion.form>
        </div>
      </motion.section>

      {quote && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl mx-auto px-4 py-8"
        >
          <div className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-2xl p-8 border border-border shadow-lg">
            <div className="flex items-start space-x-4">
              <Sparkles className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-sm font-semibold text-accent mb-2">இன்றைய மேற்கோள்</h3>
                <p className="text-xl sm:text-2xl font-medium text-foreground mb-2">{quote.text}</p>
                <p className="text-sm text-muted-foreground">— {quote.author}</p>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      <section className="max-w-7xl mx-auto px-4 py-12">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-foreground mb-8 text-center"
        >
          வகைகள்
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={category.path}
                  onClick={playClickSound}
                  className="block"
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className={`bg-gradient-to-br ${category.color} rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer`}
                  >
                    <Icon className="w-12 h-12 text-white mb-4" />
                    <h3 className="text-xl font-bold text-white">{category.name}</h3>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-foreground"
          >
            சிறப்பு புத்தகங்கள்
          </motion.h2>
          <Link
            to="/books"
            onClick={playClickSound}
            className="text-primary hover:text-primary/80 font-medium flex items-center space-x-2"
          >
            <span>அனைத்தையும் காண்க</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <BookCard book={book} />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16 px-4 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              எங்கள் நோக்கம்
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-card rounded-xl p-6 shadow-md">
                <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">தமிழ் இலக்கியத்தை பாதுகாத்தல்</h3>
                <p className="text-sm text-muted-foreground">
                  தமிழ் இலக்கியத்தை டிஜிட்டல் வடிவில் பாதுகாக்கிறது
                </p>
              </div>
              <div className="bg-card rounded-xl p-6 shadow-md">
                <Heart className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">அனைவருக்கும் அணுகல்</h3>
                <p className="text-sm text-muted-foreground">
                  Audio (TTS) மூலம் அனைவருக்கும் அணுகல் வசதி வழங்குகிறது
                </p>
              </div>
              <div className="bg-card rounded-xl p-6 shadow-md">
                <Sparkles className="w-12 h-12 text-chart-3 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">வாசிப்பு ஊக்குவிப்பு</h3>
                <p className="text-sm text-muted-foreground">
                  படிக்கும் பழக்கத்தை ஊக்குவிக்கிறது
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
