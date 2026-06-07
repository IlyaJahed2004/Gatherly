import React from 'react';
import EventCard from '../../components/EventCard';
import CalendarWidget from '../../components/CalendarWidget';

const HomePage = () => {
  return (
    // Background: #F3F4F6
    <div className="min-h-screen bg-[#F3F4F6] py-10 px-6 lg:px-10">
      {/* تمام صفحه تر شدن: استفاده از max-w-[95%] یا max-w-[1600px] */}
      <div className="max-w-[95%] mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Events (2 Columns inside) */}
        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          <EventCard 
            title="chinese festivals"
            date="15 Mar 2026 9:00 AM"
            location="Cascade National Park"
            description="Join us as we celebrate the spirit of Chinese culture with vibrant lanterns, dragon dances, and festive traditions."
            hostName="Joo Min"
            status="going"
            imageUrl="https://placehold.co/600x400/e2e8f0/64748b?text=Festival"
          />
          <EventCard 
            title="Nature Reset Retreat"
            date="15 Mar 2026 12:00 PM"
            location="North Cascades Highway"
            description="Take a break from your daily routine and reconnect with nature. Relax in a peaceful forest setting, enjoy stunning lake views..."
            hostName="Mariya"
            imageUrl="https://placehold.co/600x400/e2e8f0/64748b?text=Nature"
          />
        </div>

        {/* Right Column: Widgets */}
        {/* استفاده از flex-col و h-full برای هم‌قد شدن با کارت‌های سمت چپ */}
        <div className="flex flex-col gap-8 h-full">
          
          {/* Event Type Widget */}
          <div className="bg-[#FFFFFF] rounded-3xl p-8 shadow-sm border border-gray-100 flex-1">
            <h3 className="text-[32px] font-medium text-[#1F2937] mb-8">Event Type</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Filter Buttons: 20px, Medium */}
              <button className="py-2 px-4 rounded-full border border-[#14B8A6] text-[#14B8A6] text-[20px] font-medium hover:bg-teal-50">Sports</button>
              <button className="py-2 px-4 rounded-full border border-[#14B8A6] text-[#14B8A6] text-[20px] font-medium hover:bg-teal-50">Science</button>
              <button className="py-2 px-4 rounded-full bg-[#14B8A6] text-[#FFFFFF] text-[20px] font-medium">Leisure</button>
              <button className="py-2 px-4 rounded-full border border-[#14B8A6] text-[#14B8A6] text-[20px] font-medium hover:bg-teal-50">Other</button>
            </div>
          </div>

          {/* Calendar Widget */}
          <div className="flex-1">
            <CalendarWidget />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default HomePage;