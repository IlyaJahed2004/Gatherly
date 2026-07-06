import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Shape kept close to what a real "event comments" API would return, so wiring the
// backend in later is a matter of replacing loadComments/postComment below.
export interface EventComment {
  id: string;
  authorId: string;
  authorName: string;
  authorImageUrl?: string | null;
  message: string;
  createdAt: string; // ISO string
}

interface EventChatProps {
  eventId: string;
  currentUserId?: string;
  currentUserName?: string;
  currentUserImageUrl?: string | null;
}

// TODO(backend wiring): replace with GET /events/{eventId}/comments
const MOCK_COMMENTS: EventComment[] = [
  {
    id: '1',
    authorId: 'bob',
    authorName: 'Bob',
    authorImageUrl: 'https://placehold.co/100x100/38bdf8/ffffff?text=B',
    message: 'hello',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    authorId: 'jo',
    authorName: 'Jo',
    authorImageUrl: 'https://placehold.co/100x100/94a3b8/ffffff?text=J',
    message: 'hi',
    createdAt: new Date(Date.now() - 13 * 60 * 1000).toISOString(),
  },
];

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

const EventChat: React.FC<EventChatProps> = ({
  eventId,
  currentUserId = 'me',
  currentUserName = 'You',
  currentUserImageUrl,
}) => {
  const navigate = useNavigate();
  const [comments, setComments] = useState<EventComment[]>(MOCK_COMMENTS);
  const [draft, setDraft] = useState('');

  // TODO(backend wiring): replace with POST /events/{eventId}/comments
  const postComment = (message: string) => {
    const comment: EventComment = {
      id: crypto.randomUUID(),
      authorId: currentUserId,
      authorName: currentUserName,
      authorImageUrl: currentUserImageUrl,
      message,
      createdAt: new Date().toISOString(),
    };
    setComments(prev => [comment, ...prev]);
    void eventId; // will be used once the real request is wired in
  };

  const handleSubmit = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    postComment(trimmed);
    setDraft('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className="bg-white rounded-[16px] overflow-hidden"
      style={{ boxShadow: '4px 4px 8px 0 rgba(0,0,0,0.25)' }}
    >
      <div className="bg-[#14B8A6] px-6 py-4">
        <p className="text-white text-[18px] font-medium text-center">Chat about this event</p>
      </div>

      <div className="p-6 flex flex-col gap-6">
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your comment  ( Enter to submit , SHIFT + Enter for new line )"
          dir="auto"
          rows={3}
          className="w-full px-4 py-3 rounded-[12px] border border-[#078C80] text-[15px] text-[#374151] outline-none placeholder-gray-400 resize-none"
        />

        <div className="flex flex-col gap-4">
          {comments.map(comment => (
            <div key={comment.id} className="flex items-start gap-3">
              <button
                onClick={() => navigate(`/profile/${comment.authorId}`)}
                className="flex-shrink-0"
              >
                <img
                  src={comment.authorImageUrl || `https://placehold.co/100x100/e2e8f0/64748b?text=${encodeURIComponent(comment.authorName.charAt(0))}`}
                  alt={comment.authorName}
                  className="w-[40px] h-[40px] rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://placehold.co/100x100/e2e8f0/64748b?text=${encodeURIComponent(comment.authorName.charAt(0))}`;
                  }}
                />
              </button>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/profile/${comment.authorId}`)}
                    dir="auto"
                    className="text-[#14B8A6] text-[15px] font-medium hover:underline"
                  >
                    {comment.authorName}
                  </button>
                  <span className="text-gray-400 text-[12px]">{formatRelativeTime(comment.createdAt)}</span>
                </div>
                <p dir="auto" className="text-[#1F2937] text-[15px] break-words">{comment.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventChat;
