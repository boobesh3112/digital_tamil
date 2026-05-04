# டிஜிட்டல் தமிழ் நூலகம் (Digital Tamil Library)

A modern, professional web application for preserving and accessing Tamil literature in digital format.

## 🎨 Design Features

### Visual Design
- **Color Palette**: Traditional Tamil aesthetics with maroon (#8B1538), gold (#D4AF37), and beige (#F5F5DC)
- **Typography**: 
  - Headings: Tiro Tamil (stylized)
  - Body: Noto Sans Tamil
- **Effects**: Glassmorphism, soft shadows, gradients, cultural patterns
- **Animations**: Smooth transitions, micro-interactions, scroll-based animations

### Core Features
1. **Text-to-Speech (TTS)**: Listen to books in Tamil using Web Speech API
2. **Favorites System**: Save favorite books (requires authentication)
3. **Dark Mode**: Toggle between light and dark themes
4. **Quote of the Day**: Random quotes from 1000 pre-stored Tamil quotes
5. **Classical Section**: Dedicated Thirukkural reading experience

## 📱 Pages

1. **முகப்பு (Home)**: Hero section, search, categories, featured books, daily quote
2. **புத்தக பட்டியல் (Book Listing)**: Grid view with category/search filters
3. **வாசிப்பு (Reading Page)**: Clean reading UI with TTS, favorites, font controls
4. **உள்நுழை/பதிவு (Login/Signup)**: Authentication pages
5. **திருக்குறள் (Classical)**: Thirukkural with explanations
6. **பிடித்தவை (Favorites)**: User's saved books

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4 with custom Tamil theme
- **Animations**: Motion (Framer Motion)
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **Server**: Hono (Edge Functions)
- **Icons**: Lucide React

## 📚 Content

- **25 Tamil Books**: Mix of classical and modern literature
- **1000 Tamil Quotes**: From திருக்குறள், பாரதியார், ஔவையார், etc.
- **10 Thirukkural**: Sample kurals with explanations (expandable to 1330)

## 🎯 Purpose

1. **பாதுகாப்பு**: Preserve Tamil literature in digital format
2. **அணுகல்**: Provide accessibility through TTS for all users
3. **ஊக்குவிப்பு**: Encourage reading habits

## 🚀 Getting Started

The app is automatically initialized with sample data on first load. 

### Authentication
- Users can sign up and login to save favorites
- Email confirmation is auto-enabled (no email server required)

### Text-to-Speech
- Uses browser's built-in Web Speech API
- Configured for Tamil language (ta-IN)
- Adjustable reading speed and controls

## 🔊 Sound Effects

- Button clicks: Subtle sine wave (800Hz)
- Page transitions: Smooth transition sound (600Hz)

## 📱 Responsive Design

Fully responsive with mobile-first approach:
- Mobile: Single column, touch-friendly
- Tablet: 2-column grid
- Desktop: 4-column grid with sidebar filters

## 🌟 Highlights

- Professional production-ready design
- Smooth animations without overwhelming users
- Cultural authenticity with modern UX
- Accessible through TTS
- Fast and responsive
- Clean, maintainable code structure
