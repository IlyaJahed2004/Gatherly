import React from 'react';
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
  const getStatusBadgeStyle = () => {
    switch (status) {
      case 'going':
        return 'bg-green-100 text-green-800';
      case 'hosting':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* بخش بالای کارت: عکس و بج‌ها */}
      <div className="relative h-48 w-full">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        
        {/* بج وضعیت (بالا راست) */}
        {status !== 'open' && (
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeStyle()}`}>
            {status}
          </div>
        )}

        {/* تاریخ (پایین چپ روی عکس) */}
        <div className="absolute bottom-3 left-3 bg-white px-3 py-2 rounded-lg shadow-sm text-center">
            {/* اینجا می‌تونیم ماه و روز رو از هم جدا کنیم اگه دیتای بهتری داشتیم */}
            <span className="block text-sm font-bold text-gray-800">{date}</span>
        </div>
      </div>

      {/* بخش پایین کارت: اطلاعات رویداد */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
        
        {/* مکان */}
        <div className="flex items-center text-gray-500 text-sm mb-3">
          {/* آیکون پین ساده (می‌تونی بعدا با آیکون‌های Heroicons یا lucide-react جایگزین کنی) */}
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          {location}
        </div>

        {/* توضیحات */}
        <p className="text-gray-600 text-sm mb-5 line-clamp-2">
          {description}
        </p>

        {/* فوتر کارت: میزبان و دکمه */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <img
              src={hostAvatarUrl}
              alt={hostName}
              className="w-8 h-8 rounded-full mr-2 object-cover"
            />
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Hosted by</span>
              <span className="text-sm font-semibold text-gray-800">{hostName}</span>
            </div>
          </div>
          <button className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;