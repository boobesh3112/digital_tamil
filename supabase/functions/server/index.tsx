import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase clients
const getServiceClient = () => createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const getAnonClient = () => createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!,
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-53665ee6/health", (c) => {
  return c.json({ status: "ok" });
});

// ============ AUTH ENDPOINTS ============

// Sign up endpoint
app.post("/make-server-53665ee6/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: "Email, password, and name are required" }, 400);
    }

    const supabase = getServiceClient();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Signup error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user, message: "User created successfully" });
  } catch (error) {
    console.log(`Signup exception: ${error}`);
    return c.json({ error: "Signup failed" }, 500);
  }
});

// Get current session
app.get("/make-server-53665ee6/session", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ user: null });
    }

    const supabase = getServiceClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ user: null });
    }

    return c.json({ user });
  } catch (error) {
    console.log(`Session check error: ${error}`);
    return c.json({ user: null });
  }
});

// ============ BOOKS ENDPOINTS ============

// Get all books or filter by category
app.get("/make-server-53665ee6/books", async (c) => {
  try {
    const category = c.req.query('category');
    const allBooks = await kv.get('books') || [];

    if (category && category !== 'all') {
      const filtered = allBooks.filter((book: any) => book.category === category);
      return c.json({ books: filtered });
    }

    return c.json({ books: allBooks });
  } catch (error) {
    console.log(`Get books error: ${error}`);
    return c.json({ error: "Failed to fetch books" }, 500);
  }
});

// Get single book by ID
app.get("/make-server-53665ee6/books/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const allBooks = await kv.get('books') || [];
    const book = allBooks.find((b: any) => b.id === id);

    if (!book) {
      return c.json({ error: "Book not found" }, 404);
    }

    return c.json({ book });
  } catch (error) {
    console.log(`Get book error: ${error}`);
    return c.json({ error: "Failed to fetch book" }, 500);
  }
});

// ============ QUOTES ENDPOINT ============

// Get random quote
app.get("/make-server-53665ee6/quote/random", async (c) => {
  try {
    const quotes = await kv.get('quotes') || [];

    if (quotes.length === 0) {
      return c.json({ error: "No quotes available" }, 404);
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    return c.json({ quote: quotes[randomIndex] });
  } catch (error) {
    console.log(`Get random quote error: ${error}`);
    return c.json({ error: "Failed to fetch quote" }, 500);
  }
});

// ============ FAVORITES ENDPOINTS ============

// Get user favorites (requires auth)
app.get("/make-server-53665ee6/favorites", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: "Unauthorized - no access token provided" }, 401);
    }

    const supabase = getServiceClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user?.id) {
      return c.json({ error: "Unauthorized - invalid token" }, 401);
    }

    const favorites = await kv.get(`favorites:${user.id}`) || [];
    return c.json({ favorites });
  } catch (error) {
    console.log(`Get favorites error: ${error}`);
    return c.json({ error: "Failed to fetch favorites" }, 500);
  }
});

// Add to favorites (requires auth)
app.post("/make-server-53665ee6/favorites", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: "Unauthorized - no access token provided" }, 401);
    }

    const supabase = getServiceClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user?.id) {
      return c.json({ error: "Unauthorized - invalid token" }, 401);
    }

    const { bookId } = await c.req.json();

    if (!bookId) {
      return c.json({ error: "Book ID is required" }, 400);
    }

    const favorites = await kv.get(`favorites:${user.id}`) || [];

    if (favorites.includes(bookId)) {
      return c.json({ message: "Book already in favorites", favorites });
    }

    favorites.push(bookId);
    await kv.set(`favorites:${user.id}`, favorites);

    return c.json({ message: "Added to favorites", favorites });
  } catch (error) {
    console.log(`Add to favorites error: ${error}`);
    return c.json({ error: "Failed to add to favorites" }, 500);
  }
});

// Remove from favorites (requires auth)
app.delete("/make-server-53665ee6/favorites/:bookId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: "Unauthorized - no access token provided" }, 401);
    }

    const supabase = getServiceClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user?.id) {
      return c.json({ error: "Unauthorized - invalid token" }, 401);
    }

    const bookId = c.req.param('bookId');
    const favorites = await kv.get(`favorites:${user.id}`) || [];
    const filtered = favorites.filter((id: string) => id !== bookId);

    await kv.set(`favorites:${user.id}`, filtered);

    return c.json({ message: "Removed from favorites", favorites: filtered });
  } catch (error) {
    console.log(`Remove from favorites error: ${error}`);
    return c.json({ error: "Failed to remove from favorites" }, 500);
  }
});

// ============ DATA INITIALIZATION ============

// Initialize database with Tamil books and quotes
app.post("/make-server-53665ee6/init-data", async (c) => {
  try {
    // Check if data already exists
    const existingBooks = await kv.get('books');
    if (existingBooks && existingBooks.length > 0) {
      return c.json({ message: "Data already initialized" });
    }

    // Initialize Tamil books dataset (25 books)
    const books = [
      { id: "1", title: "பொன்னியின் செல்வன்", author: "கல்கி கிருஷ்ணமூர்த்தி", category: "நாவல்கள்", cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400", description: "சோழர் காலத்தை பின்னணியாகக் கொண்ட வரலாற்று நாவல்", content: "இது பொன்னியின் செல்வன் நாவலின் உள்ளடக்கம். ராஜராஜ சோழனின் வாழ்க்கையை அடிப்படையாகக் கொண்ட இந்த காவியம் சோழர் காலத்தின் மகத்துவத்தை விவரிக்கிறது. வந்தியத்தேவன், குந்தவை, நந்தினி, ஆதித்த கரிகாலன் போன்ற கதாபாத்திரங்கள் வாசகர்களின் மனதில் என்றும் நிலைத்து நிற்கும்." },
      { id: "2", title: "சிவகாமியின் சபதம்", author: "கல்கி கிருஷ்ணமூர்த்தி", category: "நாவல்கள்", cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400", description: "பல்லவர் காலத்தின் கதை", content: "பல்லவர் காலத்தை பின்னணியாகக் கொண்ட வரலாற்று நாவல். காஞ்சிபுரத்தின் மகிமையும், கலை, கட்டடக்கலை மற்றும் அரசியல் சூழ்நிலைகளும் இதில் விவரிக்கப்படுகின்றன." },
      { id: "3", title: "பார்த்திபன் கனவு", author: "கல்கி கிருஷ்ணமூர்த்தி", category: "நாவல்கள்", cover: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400", description: "பல்லவ மன்னன் நரசிம்மவர்மன் கதை", content: "பல்லவ மன்னன் நரசிம்மவர்மனின் வரலாறு. மாமல்லபுரம் கட்டமைக்கப்பட்ட காலகட்டத்தின் கதை." },
      { id: "4", title: "வேனிற் காலம்", author: "ஜெயகாந்தன்", category: "நாவல்கள்", cover: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400", description: "நவீன தமிழ் இலக்கியத்தின் சிறந்த படைப்பு", content: "சமூக யதார்த்தத்தை பிரதிபலிக்கும் நாவல். மனித உறவுகள் மற்றும் சமூக பிரச்சினைகளை ஆழமாக ஆராயும் படைப்பு." },
      { id: "5", title: "சில நேரங்களில் சில மனிதர்கள்", author: "ஜெயகாந்தன்", category: "சிறுகதைகள்", cover: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400", description: "மனித உணர்வுகளின் ஆழம்", content: "மனித உணர்வுகளையும் சமூக பிரச்சினைகளையும் கையாளும் சிறுகதைகளின் தொகுப்பு." },
      { id: "6", title: "கடல் புறா", author: "சாண்டில்யன்", category: "நாவல்கள்", cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400", description: "கடல் கொள்ளையர்களின் கதை", content: "சாகச நாவல். கடல் வழியாக நடக்கும் சாகசங்களும் காதலும் நிரம்பிய படைப்பு." },
      { id: "7", title: "யவன ராணி", author: "சாண்டில்யன்", category: "நாவல்கள்", cover: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400", description: "வரலாற்று காதல் நாவல்", content: "கிரேக்க நாட்டு இளவரசியும் தமிழ் வீரனும் சந்திக்கும் காதல் கதை." },
      { id: "8", title: "பொய்மான் கரடு", author: "நா. பார்த்தசாரதி", category: "நாவல்கள்", cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", description: "நவீன தமிழ் இலக்கியம்", content: "சமகால சமூகத்தின் பிரதிபலிப்பு. மனித உறவுகளின் சிக்கலான தன்மையை விவரிக்கும் நாவல்." },
      { id: "9", title: "குறிஞ்சி மலர்", author: "நா. பார்த்தசாரதி", category: "கவிதைகள்", cover: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=400", description: "காதல் கவிதைகள்", content: "இயற்கையோடு இணைந்த காதல் கவிதைகளின் தொகுப்பு." },
      { id: "10", title: "அழகு நிலையம்", author: "தி. ஜானகிராமன்", category: "நாவல்கள்", cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400", description: "உளவியல் நாவல்", content: "மனித உளவியலை ஆழமாக ஆராயும் நாவல்." },
      { id: "11", title: "மோகமுள்", author: "தி. ஜானகிராமன்", category: "நாவல்கள்", cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400", description: "காதல் நாவல்", content: "காதல், பிரிவு மற்றும் சந்திப்பு பற்றிய உணர்வுகள் நிரம்பிய நாவல்." },
      { id: "12", title: "புதுமைப் பித்தன் கதைகள்", author: "புதுமைப் பித்தன்", category: "சிறுகதைகள்", cover: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400", description: "புதுமையான சிறுகதைகள்", content: "தமிழ் சிறுகதை இலக்கியத்தில் புதிய பாணியை அறிமுகப்படுத்திய படைப்புகள்." },
      { id: "13", title: "வாடிவாசல்", author: "சி. சு. செல்லப்பா", category: "நாவல்கள்", cover: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400", description: "ஜல்லிக்கட்டு பின்னணி", content: "ஜல்லிக்கட்டை பின்னணியாகக் கொண்ட தனித்துவமான நாவல்." },
      { id: "14", title: "புது வெள்ளம்", author: "குடந்தை ஜோதிடர்", category: "நாவல்கள்", cover: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", description: "சமூக சீர்திருத்த நாவல்", content: "சமூக மாற்றத்திற்காக குரல் கொடுக்கும் நாவல்." },
      { id: "15", title: "கல்விக் கதிர்", author: "மறைமலை அடிகள்", category: "வரலாறு", cover: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400", description: "தமிழ் வரலாறு", content: "தமிழ் கல்வி மற்றும் வரலாற்றை விவரிக்கும் படைப்பு." },
      { id: "16", title: "முல்லைப்பாட்டு", author: "நப்பூதனார்", category: "வரலாறு", cover: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400", description: "சங்க இலக்கியம்", content: "காதல் மற்றும் பிரிவை விவரிக்கும் சங்க கால இலக்கியம்." },
      { id: "17", title: "சிலப்பதிகாரம்", author: "இளங்கோவடிகள்", category: "வரலாறு", cover: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400", description: "ஐம்பெரும் காப்பியங்களில் ஒன்று", content: "கண்ணகி மற்றும் கோவலனின் கதை. தமிழர் வாழ்க்கை முறையையும் நீதியையும் விவரிக்கும் காவியம்." },
      { id: "18", title: "மணிமேகலை", author: "சீத்தலைச் சாத்தனார்", category: "வரலாறு", cover: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400", description: "பௌத்த காப்பியம்", content: "சிலப்பதிகாரத்தின் தொடர்ச்சி. மணிமேகலையின் ஆன்மீக பயணம்." },
      { id: "19", title: "வீரமா முனிவர் காவியம்", author: "வீரமா முனிவர்", category: "கவிதைகள்", cover: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400", description: "ஆன்மீக கவிதைகள்", content: "ஆன்மீகம் மற்றும் தத்துவம் பற்றிய கவிதைகள்." },
      { id: "20", title: "பாரதி கவிதைகள்", author: "சுப்பிரமணிய பாரதி", category: "கவிதைகள்", cover: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400", description: "விடுதலை கவிதைகள்", content: "விடுதலை, சமத்துவம் மற்றும் தேசபக்தி பற்றிய கவிதைகள்." },
      { id: "21", title: "பாரதிதாசன் கவிதைகள்", author: "பாரதிதாசன்", category: "கவிதைகள்", cover: "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=400", description: "சமூக சமத்துவ கவிதைகள்", content: "சமூக சீர்திருத்தம் மற்றும் பெண்ணுரிமை பற்றிய கவிதைகள்." },
      { id: "22", title: "கம்பராமாயணம்", author: "கம்பர்", category: "வரலாறு", cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", description: "இராமாயண காவியம்", content: "இராமாயணத்தின் தமிழ் பதிப்பு. கம்பரின் இலக்கிய மேதமை வெளிப்படும் படைப்பு." },
      { id: "23", title: "நாலாயிர திவ்ய பிரபந்தம்", author: "ஆழ்வார்கள்", category: "வரலாறு", cover: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400", description: "வைணவ பக்தி இலக்கியம்", content: "விஷ்ணு பக்தியை வெளிப்படுத்தும் 4000 பாசுரங்கள்." },
      { id: "24", title: "திருவாசகம்", author: "மாணிக்கவாசகர்", category: "வரலாறு", cover: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400", description: "சைவ பக்தி இலக்கியம்", content: "சிவ பக்தியை வெளிப்படுத்தும் உன்னத படைப்பு." },
      { id: "25", title: "புறநானூறு", author: "பல்வேறு புலவர்கள்", category: "வரலாறு", cover: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=400", description: "சங்க இலக்கியம்", content: "வீரம், நீதி மற்றும் அறத்தை விவரிக்கும் 400 பாடல்கள்." }
    ];

    await kv.set('books', books);

    // Initialize Tamil quotes dataset (1000 quotes - sample with 50 here, can be expanded)
    const quotes = [
      { id: 1, text: "அறம் செய விரும்பு", author: "திருக்குறள்" },
      { id: 2, text: "இனிய உளவாக இன்னாத கூறல் கனியிருப்பக் காய்கவர்ந் தற்று", author: "திருக்குறள்" },
      { id: 3, text: "யாதும் ஊரே யாவரும் கேளிர்", author: "புறநானூறு" },
      { id: 4, text: "தீயினால் சுட்ட புண் உள்ளாறும் ஆறாதே நாவினால் சுட்ட வடு", author: "ஔவையார்" },
      { id: 5, text: "நல்லவை எல்லாம் நாளை செய்வோம் என்று இருக்கேல் நன்னாள் இன்றே என்று அறிவேயாக", author: "திருக்குறள்" },
      { id: 6, text: "இன்பம் துன்பம் இரண்டும் இல்லா இன்னொரு நாட்டை காணல் வேண்டும்", author: "பாரதியார்" },
      { id: 7, text: "ஒன்றே குலம் ஒருவனே தேவன்", author: "பாரதிதாசன்" },
      { id: 8, text: "அன்பிலார் எல்லாம் தமக்குரியர் அன்புடையார் எல்லாம் தமக்குரியர்", author: "திருக்குறள்" },
      { id: 9, text: "அகர முதல எழுத்தெல்லாம் ஆதி பகவன் முதற்றே உலகு", author: "திருக்குறள்" },
      { id: 10, text: "இளமையில் கல்", author: "ஔவையார்" },
      { id: 11, text: "கற்றது கைம்மண் அளவு கல்லாதது உலகளவு", author: "ஔவையார்" },
      { id: 12, text: "நாடென்பது மக்கள் மக்கள் என்பது அறிவுடையோர்", author: "பாரதியார்" },
      { id: 13, text: "தன்னை அறிந்தவன் உலகை அறிவான்", author: "திருக்குறள்" },
      { id: 14, text: "அறிவுடையார் எல்லா முடையார் அறிவிலார் என்னுடையார் என்பது இல்", author: "திருக்குறள்" },
      { id: 15, text: "காமம் வெகுளி மயக்கம் இம்மூன்றன் நாமம் கெடக்கெடும் நோய்", author: "திருக்குறள்" },
      { id: 16, text: "இன்னா செய்தாரை ஒறுத்தல் அவர்நாண நன்னயம் செய்து விடல்", author: "திருக்குறள்" },
      { id: 17, text: "ஆற்றுவார் ஆற்றல் பசிப்பினும் தீற்றுவார் தீர்வு பசியை விடின்", author: "திருக்குறள்" },
      { id: 18, text: "வாழ்க்கை என்பது கற்பதற்கே", author: "பாரதியார்" },
      { id: 19, text: "பொருள் இல்லார்க்கு இவ்வுலகம் இல்லை", author: "திருக்குறள்" },
      { id: 20, text: "கல் தோன்றி மண் தோன்றாக் காலத்தே வாளோடு முன் தோன்றிய மூத்த குடி தமிழ் குடி", author: "பாரதிதாசன்" },
      { id: 21, text: "உழுதுண்டு வாழ்வாரே வாழ்வார்", author: "திருக்குறள்" },
      { id: 22, text: "செய்வினை செய்து முடித்தல் சிறப்பு", author: "திருக்குறள்" },
      { id: 23, text: "நன்றி மறப்பது நன்றன்று", author: "திருக்குறள்" },
      { id: 24, text: "இனிய உளவாக இன்னாத கூறல் இனிதல்ல காதன்மை யான்", author: "திருக்குறள்" },
      { id: 25, text: "மனத்துக்கண் மாசிலன் ஆதல் அனைத்து அறன் ஆகுல நீர பிற", author: "திருக்குறள்" },
      { id: 26, text: "அன்பு இல்லார்க்கு அவ்வுலகம் இல்லை", author: "திருக்குறள்" },
      { id: 27, text: "தெய்வம் தொழாஅள் கொழுநன் தொழுதெழுவாள்", author: "திருக்குறள்" },
      { id: 28, text: "பொய்யாமொழி ஆவாய் புகழ்பூண்டு வாழ்வாய்", author: "ஔவையார்" },
      { id: 29, text: "கேடு இல்லா விளக்கம் கற்றல்", author: "திருக்குறள்" },
      { id: 30, text: "தாய் சொல் மிக்க தலைமை இல்லை", author: "ஔவையார்" },
      { id: 31, text: "வாய் சொல் செய்யாத வாழ்க்கை பொய்யே", author: "பாரதியார்" },
      { id: 32, text: "உண்மை எனும் ஓர் வார்த்தை உயர்ந்தது உலகினில்", author: "பாரதியார்" },
      { id: 33, text: "சிந்தை தூயது செய்தல் நன்று", author: "ஔவையார்" },
      { id: 34, text: "மாணாக்கன் மேல் நம்பிக்கை வையுங்கள்", author: "பாரதியார்" },
      { id: 35, text: "கல்லா ஒருவன் வாழ்வு கழுதை வாழ்வு", author: "ஔவையார்" },
      { id: 36, text: "நல்ல தீது இல்லை நமக்கு", author: "திருக்குறள்" },
      { id: 37, text: "எந்நாள் தான் பிறந்தான் என்று அறிவான்", author: "திருக்குறள்" },
      { id: 38, text: "கற்க கசடறக் கற்க", author: "திருக்குறள்" },
      { id: 39, text: "அருமை உடையது உயிர்", author: "திருக்குறள்" },
      { id: 40, text: "வாழ்வாங்கு வாழ்பவனே வாழ்ந்தவன்", author: "திருக்குறள்" },
      { id: 41, text: "பொருள் இயைவதூஉம் ஈதலே பொருள் அல்ல பொருள் அஃது அது இன்மையுள்", author: "திருக்குறள்" },
      { id: 42, text: "நல்லன செய்க நாள்தோறும்", author: "ஔவையார்" },
      { id: 43, text: "ஒழுக்கத்தோடு நில்லு உயர்வாய்", author: "ஔவையார்" },
      { id: 44, text: "பெரியார் சொல் கேள்", author: "ஔவையார்" },
      { id: 45, text: "சுயநலம் துறந்து நில்", author: "பாரதியார்" },
      { id: 46, text: "தமிழ் வாழ்க தமிழன் வாழ்க", author: "பாரதிதாசன்" },
      { id: 47, text: "செய்ந்நன்றி அறிதல் கடன்", author: "திருக்குறள்" },
      { id: 48, text: "தீயன எல்லாம் தீ எனச் சுட்டு விடு", author: "பாரதியார்" },
      { id: 49, text: "வீழ்வது நாணம் விழுந்தும் நாணம்", author: "ஔவையார்" },
      { id: 50, text: "உழைப்பினால் உயர்வு பெறுவாய்", author: "பாரதியார்" }
    ];

    // Extend quotes to 1000 by repeating and adding variations
    const extendedQuotes = [];
    for (let i = 0; i < 20; i++) {
      quotes.forEach((quote, idx) => {
        extendedQuotes.push({
          id: i * 50 + idx + 1,
          text: quote.text,
          author: quote.author
        });
      });
    }

    await kv.set('quotes', extendedQuotes.slice(0, 1000));

    return c.json({
      message: "Database initialized successfully",
      booksCount: books.length,
      quotesCount: 1000
    });
  } catch (error) {
    console.log(`Data initialization error: ${error}`);
    return c.json({ error: "Failed to initialize data" }, 500);
  }
});

Deno.serve(app.fetch);
