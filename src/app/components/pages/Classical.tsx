import { useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { playClickSound } from "../../lib/sounds";

const thirukkuralData = [
  {
    number: 1,
    kural: "அகர முதல எழுத்தெல்லாம் ஆதி\nபகவன் முதற்றே உலகு",
    explanation: "'அ' என்பது எழுத்துக்கள் அனைத்திற்கும் முதன்மையானது போல, கடவுள் உலகிற்கு முதன்மையானவர்."
  },
  {
    number: 2,
    kural: "கற்க கசடற கற்பவை கற்றபின்\nநிற்க அதற்குத் தக",
    explanation: "குற்றங்களை நீக்கும் வகையில் கல்வியை கற்க வேண்டும். கற்ற பின்னர் அதற்கேற்ப வாழ வேண்டும்."
  },
  {
    number: 3,
    kural: "மலர்மிசை ஏகினான் மாணடி சேர்ந்தார்\nநிலமிசை நீடுவாழ் வார்",
    explanation: "தாமரை மலரில் வீற்றிருக்கும் கடவுளின் திருவடியை சரணடைந்தவர்கள் நிலத்தில் நெடுங்காலம் வாழ்வார்கள்."
  },
  {
    number: 4,
    kural: "வேண்டுதல் வேண்டாமை இலானடி சேர்ந்தார்க்கு\nயாண்டும் இடும்பை இல",
    explanation: "விருப்பு வெறுப்பு இல்லாத கடவுளின் திருவடியை அடைந்தவர்களுக்கு எப்போதும் துன்பம் இல்லை."
  },
  {
    number: 5,
    kural: "இருள்சேர் இருவினையும் சேரா இறைவன்\nபொருள்சேர் புகழ்புரிந் தார் மாட்டு",
    explanation: "இருண்ட தீவினை நல்வினை இரண்டும் சாராது கடவுளின் திருவருளை புகழ்ந்து போற்றுபவர்களுக்கு."
  },
  {
    number: 6,
    kural: "பொறிவாயில் ஐந்தவித்தான் பொய்தீர் ஒழுக்க\nநெறிநின்றார் நீடுவாழ் வார்",
    explanation: "ஐம்பொறிகளை அடக்கி உண்மையான ஒழுக்கத்தின் வழியில் நிற்பவர்கள் நெடுங்காலம் வாழ்வார்கள்."
  },
  {
    number: 7,
    kural: "தனக்குவமை இல்லாதான் தாள்சேர்ந்தார்க்கு அல்லால்\nமனக்கவலை மாற்றல் அரிது",
    explanation: "தனக்கு இணையற்ற கடவுளின் திருவடியை சேர்ந்தவர்களைத் தவிர மற்றவர்களுக்கு மனக்கவலையை நீக்குதல் கடினம்."
  },
  {
    number: 8,
    kural: "அறவாழி அந்தணன் தாள்சேர்ந்தார்க்கு அல்லால்\nபிறவாழி நீந்தல் அரிது",
    explanation: "அறக்கடலான கடவுளின் திருவடியை சேர்ந்தவர்களைத் தவிர மற்றவர்களுக்கு பிறவிக் கடலைக் கடப்பது கடினம்."
  },
  {
    number: 9,
    kural: "கோளில் பொறியில் குணமிலவே எண்குணத்தான்\nதாளை வணங்காத் தலை",
    explanation: "பயனில்லாத பொறிகளையும் குணங்களையும் உடையதே எண்குணங்களையுடைய கடவுளின் திருவடியை வணங்காத தலை."
  },
  {
    number: 10,
    kural: "பிறவிப் பெருங்கடல் நீந்துவர் நீந்தார்\nஇறைவன் அடி சேராதார்",
    explanation: "பிறவிக் கடலைக் கடப்பவர்கள் கடப்பார்கள், ஆனால் கடவுளின் திருவடியை சேராதவர்கள் கடக்க மாட்டார்கள்."
  }
];

export default function Classical() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    playClickSound();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : thirukkuralData.length - 1));
  };

  const handleNext = () => {
    playClickSound();
    setCurrentIndex((prev) => (prev < thirukkuralData.length - 1 ? prev + 1 : 0));
  };

  const current = thirukkuralData[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">திருக்குறள்</h1>
          <p className="text-xl text-muted-foreground">திருவள்ளுவர் அருளிய உலக நீதி நூல்</p>
        </motion.div>

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="bg-card rounded-3xl shadow-2xl border border-border overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary to-accent p-6 text-center">
            <p className="text-2xl font-bold text-primary-foreground">குறள் எண்: {current.number}</p>
          </div>

          <div className="p-8 sm:p-12">
            <div className="mb-8 text-center">
              <div className="inline-block bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl p-8 border-2 border-primary/30">
                <pre className="text-2xl sm:text-3xl font-bold text-foreground whitespace-pre-wrap leading-relaxed">
                  {current.kural}
                </pre>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-2xl p-6 border-l-4 border-primary">
              <h3 className="text-lg font-semibold text-primary mb-3">விளக்கம்:</h3>
              <p className="text-lg text-foreground leading-relaxed">
                {current.explanation}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-6 bg-secondary/30 border-t border-border">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevious}
              className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-md"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">முந்தைய குறள்</span>
            </motion.button>

            <div className="text-sm text-muted-foreground">
              {currentIndex + 1} / {thirukkuralData.length}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-md"
            >
              <span className="font-medium">அடுத்த குறள்</span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          <p>திருக்குறள் - தமிழ் இலக்கியத்தின் அரும்பெரும் செல்வம்</p>
          <p className="mt-2">1330 குறட்பாக்களுடன் முழுமையாக விரைவில் கிடைக்கும்</p>
        </motion.div>
      </div>
    </div>
  );
}
