import { Heart, BookOpen, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="w-6 h-6 text-primary" />
              <h3 className="font-bold text-lg text-foreground">டிஜிட்டல் தமிழ் நூலகம்</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              தமிழ் இலக்கியத்தை டிஜிட்டல் வடிவில் பாதுகாத்து, அனைவருக்கும் அணுகல் வழங்குகிறோம்.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">விரைவு இணைப்புகள்</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  முகப்பு
                </a>
              </li>
              <li>
                <a href="/books" className="text-muted-foreground hover:text-primary transition-colors">
                  புத்தகங்கள்
                </a>
              </li>
              <li>
                <a href="/classical" className="text-muted-foreground hover:text-primary transition-colors">
                  திருக்குறள்
                </a>
              </li>
              <li>
                <a href="/favorites" className="text-muted-foreground hover:text-primary transition-colors">
                  பிடித்தவை
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">தொடர்பு</h4>
            <p className="text-sm text-muted-foreground mb-4">
              தமிழ் இலக்கியத்தை காக்கும் பணியில் எங்களுடன் இணையுங்கள்.
            </p>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Heart className="w-4 h-4 text-destructive fill-current" />
              <span className="text-sm">தமிழ் அன்போடு உருவாக்கப்பட்டது</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} டிஜிட்டல் தமிழ் நூலகம். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.
          </p>
        </div>
      </div>
    </footer>
  );
}
