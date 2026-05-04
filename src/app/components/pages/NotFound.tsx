import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Home, Search } from "lucide-react";
import { playClickSound } from "../../lib/sounds";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-lg"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="mb-8"
        >
          <div className="text-9xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            404
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            பக்கம் கிடைக்கவில்லை
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            நீங்கள் தேடும் பக்கம் காணப்படவில்லை அல்லது நீக்கப்பட்டது.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <button
            onClick={() => {
              playClickSound();
              navigate('/');
            }}
            className="flex items-center space-x-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg font-medium"
          >
            <Home className="w-5 h-5" />
            <span>முகப்பு பக்கம்</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              navigate('/books');
            }}
            className="flex items-center space-x-2 px-8 py-3 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-all shadow-md hover:shadow-lg font-medium"
          >
            <Search className="w-5 h-5" />
            <span>புத்தகங்கள்</span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <p className="text-sm text-muted-foreground italic">
            "தேடுவது தவறான பாதை அல்ல, சரியான வழியை கண்டறியும் முயற்சி"
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
