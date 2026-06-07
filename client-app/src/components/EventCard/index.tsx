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
    <div className="bg-[#FFFFFF] rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
      {/* Title: 32px, Medium */}
      <h3 className="text-[32px] font-medium text-[#1F2937] leading-tight mb-4 truncate">{title}</h3>
      
      {/* Image */}
      <div className="w-full h-[200px] rounded-2xl overflow-hidden mb-6">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      </div>

      {/* Date & Location: 20px, Regular */}
      <div className="flex flex-col gap-3 text-[20px] font-normal text-[#1F2937] mb-6">
        <div className="flex items-center gap-3">
          {/* Icon Frame: 24x24 */}
          <div className="w-[24px] h-[24px] flex items-center justify-center text-gray-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-[24px] h-[24px] flex items-center justify-center text-gray-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <span className="truncate">{location}</span>
        </div>
      </div>

      {/* Description: 20px, Regular */}
      <p className="text-[20px] font-normal text-[#1F2937] leading-snug line-clamp-3 mb-8 flex-grow">
        {description}
      </p>

      {/* Footer */}
      <div className="flex justify-between items-center mt-auto">
        <div className="flex items-center gap-3">
          {/* Avatar: 40x40 */}
          <img src={hostAvatarUrl} alt={hostName} className="w-[40px] h-[40px] rounded-full object-cover" />
          <div className="flex flex-col">
            <span className="text-[12px] text-[#1F2937] font-medium uppercase tracking-wide">hosted by</span>
            {/* Host Name: 20px, Regular, Orange */}
            <span className="text-[20px] font-normal text-[#F59E0B]">{hostName}</span>
          </div>
        </div>
        {/* Button: 20px, Regular */}
        <Button className="!w-auto !h-auto !py-2 !px-8 !text-[20px] !font-normal !rounded-full !bg-[#0D9488] !text-[#FFFFFF] hover:!bg-teal-700 !border-none !shadow-none">
          View
        </Button>
      </div>
    </div>
  );
};

export default EventCard;