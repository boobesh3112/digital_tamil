import { Link, useLocation } from "react-router";
import { Moon, Sun, Heart, Home, BookOpen, Sparkles, LogIn } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { playClickSound } from "../lib/sounds";
import { motion } from "motion/react";

export default function Navigation() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);
    }

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    playClickSound();
    await supabase.auth.signOut();
  };

  const navItems = [
    { path: "/", label: "முகப்பு", icon: Home },
    { path: "/books", label: "வகைகள்", icon: BookOpen },
    { path: "/classical", label: "திருக்குறள்", icon: Sparkles },
    { path: "/favorites", label: "பிடித்தவை", icon: Heart },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center space-x-3 group"
            onClick={playClickSound}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-primary">டிஜிட்டல் தமிழ் நூலகம்</h1>
              <p className="text-xs text-muted-foreground">தமிழ் இலக்கிய உலகம்</p>
            </div>
          </Link>

          <div className="flex items-center space-x-1 sm:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={playClickSound}
                  className={`
                    relative px-3 py-2 rounded-lg transition-all duration-200
                    flex items-center space-x-2
                    ${isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary rounded-lg -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            <button
              onClick={() => {
                playClickSound();
                setTheme(theme === 'dark' ? 'light' : 'dark');
              }}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-foreground">{user.user_metadata?.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all duration-200 text-sm font-medium"
                >
                  வெளியேறு
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={playClickSound}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
              >
                <LogIn className="w-4 h-4" />
                <span className="text-sm font-medium">உள்நுழை</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
