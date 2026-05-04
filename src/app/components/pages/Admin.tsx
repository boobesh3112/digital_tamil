import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Upload, BookOpen, LogOut, Trash2 } from "lucide-react";
import { playClickSound } from "../../lib/sounds";
import { supabase } from "../../lib/supabase";

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  cover_url: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("சங்க இலக்கியம்");
  const [coverUrl, setCoverUrl] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  // Check if user is admin
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch existing books
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('id, title, author, category, cover_url')
        .order('id', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (err: any) {
      console.error('Error fetching books:', err);
    }
  };

  const handleLogout = () => {
    playClickSound();
    localStorage.removeItem('isAdmin');
    supabase.auth.signOut();
    navigate('/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!title || !author || !category || !coverUrl || !description || !content) {
      setError("அனைத்து புலங்களையும் நிரப்பவும்");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('books')
        .insert([
          {
            title,
            author,
            category,
            cover_url: coverUrl,
            description,
            content,
          },
        ])
        .select();

      if (error) throw error;

      setSuccess("புத்தகம் வெற்றிகரமாக சேர்க்கப்பட்டது!");

      // Reset form
      setTitle("");
      setAuthor("");
      setCategory("சங்க இலக்கியம்");
      setCoverUrl("");
      setDescription("");
      setContent("");

      // Refresh book list
      fetchBooks();
    } catch (err: any) {
      console.error('Error uploading book:', err);
      setError("புத்தகம் சேர்க்க தோல்வி. மீண்டும் முயற்சிக்கவும்");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('இந்த புத்தகத்தை நிச்சயமாக நீக்க வேண்டுமா?')) return;

    playClickSound();
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSuccess("புத்தகம் நீக்கப்பட்டது");
      fetchBooks();
    } catch (err: any) {
      console.error('Error deleting book:', err);
      setError("புத்தகம் நீக்க தோல்வி");
    }
  };

  const categories = [
    "சங்க இலக்கியம்",
    "பக்தி இலக்கியம்",
    "நவீன இலக்கியம்",
    "சிறுகதைகள்",
    "கவிதைகள்",
    "திருக்குறள்",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">நிர்வாக பேனல்</h1>
            <p className="text-muted-foreground">புத்தகங்களை நிர்வகிக்கவும்</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>வெளியேறு</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl shadow-xl border border-border p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">புதிய புத்தகம் சேர்க்க</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  புத்தகத்தின் பெயர்
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-input-background focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  placeholder="எ.கா: திருக்குறள்"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  ஆசிரியர்
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-input-background focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  placeholder="எ.கா: திருவள்ளுவர்"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  வகை
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-input-background focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  அட்டைப் படம் URL
                </label>
                <input
                  type="url"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-input-background focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  placeholder="https://example.com/cover.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  விளக்கம்
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-input-background focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none"
                  placeholder="புத்தகத்தின் சுருக்கம்..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  உள்ளடக்கம்
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-input-background focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none"
                  placeholder="புத்தகத்தின் முழு உள்ளடக்கம்..."
                />
              </div>

              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-700 dark:text-green-400 text-sm">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>புத்தகம் சேர்க்க</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Books List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl shadow-xl border border-border p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-accent/10 rounded-lg">
                <BookOpen className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">
                புத்தகங்கள் ({books.length})
              </h2>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {books.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  புத்தகங்கள் இல்லை
                </p>
              ) : (
                books.map((book) => (
                  <div
                    key={book.id}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-all"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <img
                        src={book.cover_url}
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{book.title}</h3>
                        <p className="text-sm text-muted-foreground">{book.author}</p>
                        <p className="text-xs text-muted-foreground">{book.category}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                      title="நீக்கு"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
