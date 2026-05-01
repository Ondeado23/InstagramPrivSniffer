'use client';

import { useState } from 'react';
import { Post, useDownload } from '@/lib/hooks';

interface MediaViewerProps {
  post: Post;
  onClose: () => void;
}

export default function MediaViewer({ post, onClose }: MediaViewerProps) {
  const [downloading, setDownloading] = useState(false);
  const { download } = useDownload();

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await download(post.post_url);
    } catch {
      console.error('Download failed');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-light rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-surface-light">
          <h3 className="font-semibold text-foreground">{post.post_owner}</h3>
          <button
            onClick={onClose}
            className="text-foreground/60 hover:text-foreground transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Media Placeholder */}
          <div className="aspect-square bg-surface rounded-lg flex items-center justify-center text-6xl mb-4">
            {post.is_video ? '🎥' : '🖼️'}
          </div>

          {/* Post Info */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-foreground/80 mb-2">Post URL</p>
              <a
                href={post.post_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm break-all"
              >
                {post.post_url}
              </a>
            </div>

            {/* Collaborators */}
            {post.collaborators.length > 0 && (
              <div>
                <p className="text-sm font-medium text-foreground/80 mb-2">
                  Collaborators ({post.collaborators.length})
                </p>
                <div className="flex flex-col gap-2">
                  {post.collaborators.map((collab, idx) => (
                    <a
                      key={idx}
                      href={collab}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm break-all"
                    >
                      {collab}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamp */}
            <div className="text-xs text-foreground/60">
              Found at: {post.timestamp}
            </div>
          </div>
        </div>

        {/* Footer with Actions */}
        <div className="flex gap-3 p-4 border-t border-border sticky bottom-0 bg-surface-light">
          <a
            href={post.post_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors text-center"
          >
            Open on Instagram
          </a>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 px-4 py-2 bg-surface hover:bg-surface-light text-foreground border border-border font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {downloading ? 'Downloading...' : 'Download Media'}
          </button>
        </div>
      </div>
    </div>
  );
}
