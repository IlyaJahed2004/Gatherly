import React from 'react';
import EventCard from '../../components/EventCard';
import CalendarWidget from '../../components/CalendarWidget';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Events */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EventCard 
              title="chinese festivals"
              date="15 Mar 2026 9:00 AM"
              location="Cascade National Park"
              description="Join us as we celebrate the spirit of Chinese culture with vibrant lanterns, dragon dances, and festive traditions."
              hostName="Joo Min"
              status="going"
            />
            <EventCard 
              title="Nature Reset Retreat"
              date="15 Mar 2026 12:00 PM"
              location="North Cascades Highway"
              description="Take a break from your daily routine and reconnect with nature. Relax in a peaceful forest setting, enjoy stunning lake views..."
              hostName="Mariya"
            />
          </div>
        </div>

        {/* Right Column: Widgets */}
        <div className="space-y-6">
          {/* Event Type Widget */}
          <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
            <h3 className="text-xl font-medium text-gray-800 mb-6">Event Type</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="py-2 px-4 rounded-full border border-[#0D9488] text-[#0D9488] text-sm font-medium hover:bg-teal-50 transition-colors">I'm going</button>
              <button className="py-2 px-4 rounded-full border border-[#0D9488] text-[#0D9488] text-sm font-medium hover:bg-teal-50 transition-colors">I'm hosting</button>
              <button className="py-2 px-4 rounded-full border border-[#0D9488] text-[#0D9488] text-sm font-medium hover:bg-teal-50 transition-colors">Sports</button>
              <button className="py-2 px-4 rounded-full border border-[#0D9488] text-[#0D9488] text-sm font-medium hover:bg-teal-50 transition-colors">Science</button>
              {/* Active State Example */}
              <button className="py-2 px-4 rounded-full bg-[#0D9488] text-white text-sm font-medium shadow-sm">Leisure</button>
              <button className="py-2 px-4 rounded-full border border-[#0D9488] text-[#0D9488] text-sm font-medium hover:bg-teal-50 transition-colors">Other</button>
            </div>
          </div>

          {/* Calendar Widget */}
          <CalendarWidget />
        </div>
      </div>
    </div>
  );
};

export default HomePage;