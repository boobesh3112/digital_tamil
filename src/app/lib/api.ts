import { API_BASE } from './supabase';

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export async function initializeData() {
  const response = await fetch(`${API_BASE}/init-data`, {
    method: 'POST',
  });
  return response.json();
}

export async function getBooks(category?: string) {
  const url = category && category !== 'all'
    ? `${API_BASE}/books?category=${encodeURIComponent(category)}`
    : `${API_BASE}/books`;

  const response = await fetch(url);
  return response.json();
}

export async function getBook(id: string) {
  const response = await fetch(`${API_BASE}/books/${id}`);
  return response.json();
}

export async function getRandomQuote() {
  const response = await fetch(`${API_BASE}/quote/random`);
  return response.json();
}

export async function getFavorites() {
  if (!accessToken) return { favorites: [] };

  const response = await fetch(`${API_BASE}/favorites`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  return response.json();
}

export async function addToFavorites(bookId: string) {
  if (!accessToken) throw new Error('Not authenticated');

  const response = await fetch(`${API_BASE}/favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ bookId })
  });
  return response.json();
}

export async function removeFromFavorites(bookId: string) {
  if (!accessToken) throw new Error('Not authenticated');

  const response = await fetch(`${API_BASE}/favorites/${bookId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  return response.json();
}

export async function signup(email: string, password: string, name: string) {
  const response = await fetch(`${API_BASE}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password, name })
  });
  return response.json();
}

export async function getSession() {
  if (!accessToken) return { user: null };

  const response = await fetch(`${API_BASE}/session`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  return response.json();
}
