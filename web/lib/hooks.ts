'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Post {
  shortcode: string;
  post_url: string;
  post_owner: string;
  is_video: boolean;
  collaborators: string[];
  timestamp: string;
}

export interface SearchResult {
  account_type: string;
  is_private: boolean;
  posts: Post[];
  error?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const useSearch = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (username: string) => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE}/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search');
    } finally {
      setLoading(false);
    }
  }, []);

  return { search, loading, result, error };
};

export const useSearchHistory = () => {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('search_history');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const addToHistory = useCallback((username: string) => {
    setHistory((prev) => {
      const filtered = prev.filter((u) => u !== username);
      const updated = [username, ...filtered].slice(0, 10);
      localStorage.setItem('search_history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('search_history');
  }, []);

  return { history, addToHistory, clearHistory };
};

export const useDownload = () => {
  const download = useCallback(async (postUrl: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_url: postUrl }),
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.headers
        .get('content-disposition')
        ?.split('filename=')[1]
        ?.replace(/"/g, '') || 'media';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
      throw err;
    }
  }, []);

  return { download };
};
