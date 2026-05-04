import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { LogIn, BookOpen, Eye, EyeOff } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { setAccessToken } from "../../lib/api";
import { playClickSound, playTransitionSound } from "../../lib/sounds";
import { useLanguage } from "../../contexts/LanguageContext";
import LanguageToggle from "../LanguageToggle";

export default function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const ADMIN_EMAIL = "admin1206@gmail.com";
  const ADMIN_PASSWORD = "hinata";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    setError("");
    setLoading(true);

    // Validation
    if (!email.trim()) {
      setError(t('emailRequired'));
      setLoading(false);
      return;
    }

    if (!password) {
      setError(t('passwordRequired'));
      setLoading(false);
      return;
    }

    // Check for admin login
    if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      try {
        // Try to sign in as admin or create admin account if doesn't exist
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
        });

        if (signInError) {
          // Admin account doesn't exist, create it
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            options: {
              data: { name: 'Admin' },
              emailRedirectTo: undefined,
            },
          });

          if (signUpError) {
            setError(t('loginFailed'));
            setLoading(false);
            return;
          }

          if (signUpData?.session?.access_token) {
            setAccessToken(signUpData.session.access_token);
            localStorage.setItem('isAdmin', 'true');
            playTransitionSound();
            navigate('/admin');
            return;
          }
        }

        if (data?.session?.access_token) {
          setAccessToken(data.session.access_token);
          localStorage.setItem('isAdmin', 'true');
          playTransitionSound();
          navigate('/admin');
          return;
        }
      } catch (err) {
        console.error('Admin login error:', err);
        setError(t('loginFailed'));
        setLoading(false);
        return;
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        // User-friendly error messages
        if (error.message.includes("Invalid login credentials")) {
          setError(t('invalidCredentials'));
        } else if (error.message.includes("Email not confirmed")) {
          setError(t('emailNotConfirmed'));
        } else {
          setError(t('loginFailed'));
        }
        setLoading(false);
        return;
      }

      if (data?.session?.access_token) {
        setAccessToken(data.session.access_token);
        playTransitionSound();
        navigate('/');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(t('loginFailed'));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4 shadow-lg">
            <BookOpen className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('login')}</h1>
          <p className="text-muted-foreground">{t('loginToAccount')}</p>
        </div>

        {/* Language Toggle */}
        <div className="flex justify-center mb-6">
          <LanguageToggle />
        </div>

        <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                {t('email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
                className="w-full px-4 py-3 rounded-lg border border-border bg-input-background focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                {t('password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-border bg-input-background focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setShowPassword(!showPassword);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm flex items-start space-x-2"
              >
                <span className="text-lg">⚠️</span>
                <span>{error}</span>
              </motion.div>
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
                  <LogIn className="w-5 h-5" />
                  <span className="font-medium">{t('login')}</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t('newUser')}{" "}
              <Link
                to="/signup"
                onClick={playClickSound}
                className="text-primary hover:text-primary/80 font-medium"
              >
                {t('signupButton')}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
