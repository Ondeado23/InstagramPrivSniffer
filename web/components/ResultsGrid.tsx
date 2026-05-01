'use client';

import { useState } from 'react';
import { Post } from '@/lib/hooks';
import MediaViewer from './MediaViewer';

interface ResultsGridProps {
  posts: Post[];
  accountType: string;
  isPrivate: boolean;
}

export default function ResultsGrid({ posts, accountType, isPrivate }: ResultsGridProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground/60">No posts found</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 p-4 bg-surface-light rounded-lg">
        <p className="text-sm text-foreground/80">
          <span className="font-semibold">Account Type:</span> {accountType}
          {isPrivate && <span className="ml-2 text-amber-500">🔒 Private</span>}
        </p>
        <p className="text-sm text-foreground/60 mt-2">
          Found {posts.length} collaborative post{posts.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div
            key={post.shortcode}
            className="bg-surface-light rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all cursor-pointer group"
            onClick={() => setSelectedPost(post)}
          >
            <div className="aspect-square bg-surface flex items-center justify-center group-hover:bg-surface-light transition-colors">
              {post.is_video ? (
                <div className="text-4xl">🎥</div>
              ) : (
                <div className="text-4xl">🖼️</div>
              )}
            </div>
            <div className="p-4">
              <p className="text-sm font-medium text-foreground truncate">
                {post.post_owner}
              </p>
              <p className="text-xs text-foreground/60 mt-1">
                {post.collaborators.length} collaborator{post.collaborators.length !== 1 ? 's' : ''}
              </p>
              <a
                href={post.post_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline mt-2 inline-block"
                onClick={(e) => e.stopPropagation()}
              >
                View on Instagram →
              </a>
            </div>
          </div>
        ))}
      </div>

      {selectedPost && (
        <MediaViewer post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </>
  );
}
