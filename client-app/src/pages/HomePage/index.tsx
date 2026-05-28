import React from 'react';
import EventCard from '../../components/EventCard';

const dummyEvents = [
  {
    id: '1',
    title: 'Tech Startup Networking',
    date: '23 Sep',
    location: 'Innovation Hub, San Francisco',
    description: 'Join us for an evening of networking with local tech startups, investors, and enthusiasts. Great opportunity to pitch your ideas.',
    hostName: 'Sarah Jenkins',
    status: 'hosting',
    imageUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=Tech+Startup',
    hostAvatarUrl: 'https://placehold.co/100x100/cbd5e1/475569?text=SJ',
  },
  {
    id: '2',
    title: 'Chinese Festivals Celebration',
    date: '15 Oct',
    location: 'Cultural Center, New York',
    description: 'Experience the vibrant colors and traditions of Chinese festivals. Food, music, and cultural performances await.',
    hostName: 'Wei Chen',
    status: 'going',
    imageUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=Chinese+Festivals',
    hostAvatarUrl: 'https://placehold.co/100x100/cbd5e1/475569?text=WC',
  },
  {
    id: '3',
    title: 'Local Art Exhibition',
    date: '02 Nov',
    location: 'City Gallery, London',
    description: 'Discover the latest contemporary art pieces from emerging local artists. Free entry for all students.',
    hostName: 'Emma Watson',
    status: 'open',
    imageUrl: 'https://placehold.co/600x400/e2e8f0/64748b?text=Art+Exhibition',
    hostAvatarUrl: 'https://placehold.co/100x100/cbd5e1/475569?text=EW',
  }
];

const HomePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* ستون سمت چپ: لیست رویدادها */}
        <div className="lg:col-span-3">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Events</h1>
          {/* گرید برای کارت‌های رویداد */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dummyEvents.map(event => (
              <EventCard 
                key={event.id}
                title={event.title}
                date={event.date}
                location={event.location}
                description={event.description}
                hostName={event.hostName}
                status={event.status as 'going' | 'hosting' | 'open'}
                imageUrl={event.imageUrl}
                hostAvatarUrl={event.hostAvatarUrl}
              />
            ))}
          </div>
        </div>

        {/* ستون سمت راست: فیلترها و تقویم */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* باکس فیلتر نوع رویداد */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg mb-4 text-gray-900">Event Type</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                <span className="text-gray-700 text-sm">Events I'm going to</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                <span className="text-gray-700 text-sm">Events I'm hosting</span>
              </label>
              
              <hr className="my-3 border-gray-100" />
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                <span className="text-gray-700 text-sm">Sports</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                <span className="text-gray-700 text-sm">Science</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                <span className="text-gray-700 text-sm">Leisure</span>
              </label>
            </div>
          </div>

          {/* باکس تقویم (فعلاً یک نگهدارنده/Placeholder) */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm min-h-[250px] flex items-center justify-center">
            <span className="text-gray-400 text-sm font-medium">Calendar Widget</span>
          </div>

        </div>
        
      </div>
    </div>
  );
};

export default HomePage;