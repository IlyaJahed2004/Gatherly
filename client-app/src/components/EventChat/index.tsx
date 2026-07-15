import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import agent from '../../api/agent';
import type { EventComment } from '../../types/event';

interface EventChatProps {
  eventId: string;
  currentUserId?: string;
  currentUserName?: string;
  currentUserImageUrl?: string | null;
}

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

const EventChat: React.FC<EventChatProps> = ({ eventId }) => {
  const navigate = useNavigate();
  const [comments, setComments] = useState<EventComment[]>([]);
  const [draft, setDraft] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;
    agent.Events.listComments(eventId)
      .then(data => {
        if (!ignore) setComments(data);
      })
      .catch(error => console.error('Failed to load comments:', error));
    return () => {
      ignore = true;
    };
  }, [eventId]);

  const postComment = async (message: string) => {
    setIsSubmitting(true);
    try {
      const comment = await agent.Events.addComment(eventId, message);
      setComments(prev => [comment, ...prev]);
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = () => {
    const trimmed = draft.trim();
    if (!trimmed || isSubmitting) return;
    setDraft('');
    void postComment(trimmed);
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