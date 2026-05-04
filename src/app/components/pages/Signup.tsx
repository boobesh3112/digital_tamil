import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { UserPlus, BookOpen, Eye, EyeOff } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { setAccessToken } from "../../lib/api";
import { playClickSound, playTransitionSound } from "../../lib/sounds";
import PasswordStrength from "../PasswordStrength";
import { useLanguage } from "../../contexts/LanguageContext";
import LanguageToggle from "../LanguageToggle";

export default function Signup() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validation
    if (!name.trim()) {
      setError(t('nameRequired'));
      setLoading(false);
      return;
    }

    if (!email.trim()) {
      setError(t('emailRequired'));
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError(t('invalidEmail'));
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(t('passwordTooShort'));
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError(t('passwordMismatch'));
      setLoading(false);
      return;
    }

    try {
      // Sign up using Supabase Auth directly
      const { data, error: signupError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
          },
          emailRedirectTo: undefined,
        },
      });

      if (signupError) {
        // User-friendly error messages
        if (signupError.message.includes("already registered")) {
          setError(t('emailExists'));
        } else if (signupError.message.includes("password")) {
          setError(t('passwordTooShort'));
        } else {
          setError(t('signupFailed'));
        }
        setLoading(false);
        return;
      }

      if (data?.session?.access_token) {
        // User is automatically logged in
        setAccessToken(data.session.access_token);
        setSuccess(t('signupSuccess'));
        playTransitionSound();
        setTimeout(() => navigate('/'), 1000);
      } else if (data?.user) {
        // Email confirmation may be required
        setSuccess(t('signupSuccess'));
        playTransitionSound();
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(t('signupFailed'));
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
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('signup')}</h1>
          <p className="text-muted-foreground">{t('createAccount')}</p>
        </div>

        {/* Language Toggle */}
        <div className="flex justify-center mb-6">
          <LanguageToggle />
        </div>

        <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                {t('name')}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                autoFocus
                className="w-full px-4 py-3 rounded-lg border border-border bg-input-background focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                placeholder={t('yourName')}
              />
            </div>

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
                  minLength={6}
                  autoComplete="new-password"
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
              <PasswordStrength password={password} />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                {t('confirmPassword')}
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-border bg-input-background focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setShowConfirmPassword(!showConfirmPassword);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-700 dark:text-green-400 text-sm flex items-start space-x-2"
              >
                <span className="text-lg">✅</span>
                <span>{success}</span>
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
                  <UserPlus className="w-5 h-5" />
                  <span className="font-medium">{t('signupButton')}</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t('existingUser')}{" "}
              <Link
                to="/login"
                onClick={playClickSound}
                className="text-primary hover:text-primary/80 font-medium"
              >
                {t('login')}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
