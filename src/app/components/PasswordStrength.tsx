import { useLanguage } from "../contexts/LanguageContext";

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const { t } = useLanguage();

  const getStrength = (pwd: string) => {
    if (!pwd) return { level: 0, textKey: "", color: "" };

    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z\d]/.test(pwd)) strength++;

    if (strength <= 1) return { level: 1, textKey: "weak", color: "bg-destructive" };
    if (strength === 2) return { level: 2, textKey: "medium", color: "bg-amber-500" };
    if (strength === 3) return { level: 3, textKey: "good", color: "bg-blue-500" };
    return { level: 4, textKey: "strong", color: "bg-green-500" };
  };

  const strength = getStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">{t('password')} {t('strong').toLowerCase()}:</span>
        <span className={`text-xs font-medium ${strength.color.replace('bg-', 'text-')}`}>
          {strength.textKey && t(strength.textKey)}
        </span>
      </div>
      <div className="flex space-x-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-all ${
              level <= strength.level ? strength.color : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
