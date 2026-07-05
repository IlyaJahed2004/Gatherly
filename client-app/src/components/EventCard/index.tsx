import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Button';
import type { EventAttendee } from '../../types/event';

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  hostId: string;
  hostName: string;
  imageUrl?: string;
  hostAvatarUrl?: string;
  isCancelled?: boolean;
  isHost?: boolean;
  isGoing?: boolean;
  attendees?: EventAttendee[];
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  date,
  location,
  description,
  hostId,
  hostName,
  imageUrl = 'https://placehold.co/600x400/e2e8f0/64748b?text=Event+Image',
  hostAvatarUrl = 'https://placehold.co/100x100/cbd5e1/475569?text=Host',
  isCancelled = false,
  isHost = false,
  isGoing = false,
  attendees = [],
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-[#FFFFFF] rounded-[16px] p-[32px] flex flex-col hover:-translate-y-1 transition-transform"
      style={{ boxShadow: '4px 4px 8px 0 rgba(0,0,0,0.25)', height: '680px' }}
    >
      <div className="flex items-center gap-2 mb-4">
        <h3 dir="auto" className="text-[32px] font-medium text-[#1F2937] leading-tight truncate">
          {title}
        </h3>
        {isCancelled && (
          <span className="flex-shrink-0 px-3 py-1 rounded-full text-[12px] font-medium bg-red-400 text-white">
            canceled
          </span>
        )}
        {isHost && (
          <span className="flex-shrink-0 px-3 py-1 rounded-full text-[12px] font-medium border border-[#F87171] text-[#F87171]">
            I'm hosting
          </span>
        )}
        {!isHost && isGoing && (
          <span className="flex-shrink-0 px-3 py-1 rounded-full text-[12px] font-medium border border-[#F87171] text-[#F87171]">
            I'm going
          </span>
        )}
      </div>

      <div
        className="w-full h-[260px] rounded-[16px] overflow-hidden mb-6 flex-shrink-0"
        style={{ boxShadow: '0px 4px 4px 0 rgba(0,0,0,0.25)' }}
      >
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="flex flex-col gap-3 text-[20px] font-normal text-[#1F2937] mb-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-[24px] h-[24px] flex items-center justify-center text-gray-500 flex-shrink-0">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-[24px] h-[24px] flex items-center justify-center text-gray-500 flex-shrink-0">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span dir="auto" className="truncate">{location}</span>
        </div>
      </div>

      <p dir="auto" className="text-[20px] font-normal text-[#1F2937] leading-snug line-clamp-3 mb-8 flex-grow">
        {description}
      </p>

      <div className="flex justify-between items-center mt-auto flex-shrink-0">
        <button
          onClick={() => navigate(`/profile/${hostId}`)}
          className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
        >
          <img
            src={hostAvatarUrl}
            alt={hostName}
            className="w-[40px] h-[40px] rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="text-[12px] text-[#1F2937] font-medium uppercase tracking-wide">hosted by</span>
            <span dir="auto" className="text-[20px] font-normal text-[#F59E0B]">{hostName}</span>
          </div>
        </button>
        {attendees.length > 0 && (
          <div className="flex items-center -space-x-3 mx-3">
            {attendees.slice(0, 4).map((attendee) => (
              <button key={attendee.id} onClick={() => navigate(`/profile/${attendee.id}`)}>
                <img
                  src={attendee.imageUrl || `https://placehold.co/100x100/e2e8f0/64748b?text=${encodeURIComponent(attendee.displayName.charAt(0))}`}
                  alt={attendee.displayName}
                  title={attendee.displayName}
                  className="w-[36px] h-[36px] rounded-full object-cover border-2 border-white hover:opacity-80 transition-opacity"
                />
              </button>
            ))}
          </div>
        )}
        <Button
          onClick={() => navigate(`/events/${id}`)}
          className="!w-[140px] !h-auto !py-2 !text-[20px] !font-normal !rounded-[16px] !bg-[#078C80] !text-[#FFFFFF] hover:!bg-[#06756b] !border-none !shadow-none"
        >
          View
        </Button>
      </div>
    </div>
  );
};

export default EventCard;