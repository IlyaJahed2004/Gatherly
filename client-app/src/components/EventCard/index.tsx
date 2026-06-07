import React from 'react';
import Button from '../Button';

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  description: string;
  hostName: string;
  status?: 'going' | 'hosting' | 'open';
  imageUrl?: string;
  hostAvatarUrl?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  date,
  location,
  description,
  hostName,
  status = 'open',
  imageUrl = 'https://placehold.co/600x400/e2e8f0/64748b?text=Event+Image',
  hostAvatarUrl = 'https://placehold.co/100x100/cbd5e1/475569?text=Host',
}) => {
  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow duration-300">
      {/* Header: Title & Badge */}
      <div className="flex justify-between items-start">
        <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
        {status !== 'open' && (
          <span className="px-3 py-1 text-xs font-medium rounded-full border border-yellow-400 text-yellow-500 whitespace-nowrap ml-2">
            I'm {status}
          </span>
        )}
      </div>

      {/* Image */}
      <div className="mt-4 w-full h-48 rounded-2xl overflow-hidden shadow-inner">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      </div>

      {/* Date & Location */}
      <div className="mt-5 flex flex-col gap-2 text-sm text-gray-600 font-medium">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <span className="truncate">{location}</span>
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 text-gray-500 text-sm leading-relaxed line-clamp-3">
        {description}
      </p>

      {/* Footer */}
      <div className="mt-6 pt-2 flex justify-between items-end">
        <div className="flex items-center gap-3">
          <img src={hostAvatarUrl} alt={hostName} className="w-10 h-10 rounded-full object-cover" />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">hosted by</span>
            <span className="text-sm font-semibold text-yellow-500">{hostName}</span>
          </div>
        </div>
        <Button className="!w-auto !h-auto !py-2.5 !px-8 !text-sm !font-medium !rounded-full !bg-[#0D9488] hover:!bg-teal-700 !border-none !shadow-md">
          View
        </Button>
      </div>
    </div>
  );
};

export default EventCard;