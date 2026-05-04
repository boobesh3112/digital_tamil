import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { motion } from "motion/react";
import { Filter } from "lucide-react";
import { getBooks } from "../../lib/api";
import BookCard from "../BookCard";

export default function BookListing() {
  const [searchParams] = useSearchParams();
  const [books, setBooks] = useState<any[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const categories = [
    { value: 'all', label: 'அனைத்தும்' },
    { value: 'நாவல்கள்', label: 'நாவல்கள்' },
    { value: 'கவிதைகள்', label: 'கவிதைகள்' },
    { value: 'வரலாறு', label: 'வரலாறு' },
    { value: 'சிறுகதைகள்', label: 'சிறுகதைகள்' },
  ];

  useEffect(() => {
    async function loadBooks() {
      try {
        const booksData = await getBooks();
        if (booksData?.books && Array.isArray(booksData.books)) {
          setBooks(booksData.books);
        }
      } catch (error) {
        console.error('Error loading books:', error);
      }
    }

    loadBooks();
  }, []);

  useEffect(() => {
    let filtered = books;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.description?.toLowerCase().includes(query)
      );
    }

    setFilteredBooks(filtered);
  }, [books, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">புத்தக பட்டியல்</h1>
          <p className="text-muted-foreground">
            {filteredBooks.length} புத்தகங்கள் கிடைத்தன
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-card rounded-xl shadow-md p-6 border border-border sticky top-24">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">வடிகட்டல்</h2>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                  தேடல்
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="தேடுங்கள்..."
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input-background focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  வகை
                </label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
                        selectedCategory === category.value
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'bg-secondary text-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>

          <div className="lg:col-span-3">
            {filteredBooks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-2xl text-muted-foreground">புத்தகங்கள் கிடைக்கவில்லை</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <BookCard book={book} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
