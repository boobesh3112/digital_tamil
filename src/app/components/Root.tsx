import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { setAccessToken, initializeData } from "../lib/api";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "../contexts/LanguageContext";

export default function Root() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function setup() {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.access_token) {
          setAccessToken(data.session.access_token);
        }

        // Try to initialize data, but don't fail if backend isn't deployed
        try {
          await initializeData();
        } catch (error) {
          console.warn('Backend initialization failed - Edge Function may not be deployed yet:', error);
        }
      } catch (error) {
        console.error('Setup error:', error);
      } finally {
        setInitialized(true);
      }
    }

    setup();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token) {
        setAccessToken(session.access_token);
      } else {
        setAccessToken(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">ஏற்றுகிறது...</p>
        </div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <div className="min-h-screen bg-background flex flex-col">
          <Navigation />
          <main className="flex-grow">
            <Outlet />
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    </LanguageProvider>
  );
}
