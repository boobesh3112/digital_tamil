import { motion } from "motion/react";
import { AlertCircle, ExternalLink } from "lucide-react";

export default function DeploymentNotice() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-accent/20 border border-accent/50 rounded-xl p-6 mb-8"
    >
      <div className="flex items-start space-x-4">
        <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-2">
            Backend Edge Function தேவை
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            புத்தகங்கள் மற்றும் தரவு ஏற்றுவதற்கு Supabase Edge Function ஐ deploy செய்ய வேண்டும்.
          </p>
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-sm font-medium text-foreground mb-2">படிகள்:</p>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Make settings பக்கத்திற்கு செல்லவும்</li>
              <li>Supabase பிரிவில் "Deploy Edge Function" பட்டனை கிளிக் செய்யவும்</li>
              <li>Deploy முடிந்ததும், இந்த பக்கத்தை refresh செய்யவும்</li>
            </ol>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
