import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import EventCard from '../../components/EventCard';
import CalendarWidget from '../../components/CalendarWidget';
import { useStore } from '../../stores/rootStore';

const CATEGORIES = [
  { label: 'Sports', value: 1 },
  { label: 'Science', value: 2 },
  { label: 'Leisure', value: 3 },
  { label: 'Other', value: 4 },
];

const HomePage = observer(() => {
  const { eventStore } = useStore();
  const { events, isLoading, selectedCategory, setCategory, loadEvents } = eventStore;

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const sidebar = (
    <div className="flex flex-col gap-8">
      {/* Event Type Widget */}
      <div
        className="bg-[#FFFFFF] rounded-[16px] p-[32px]"
        style={{ boxShadow: '4px 4px 8px 0 rgba(0,0,0,0.25)' }}
      >
        <h3 className="text-[32px] font-medium text-[#1F2937] mb-8">Event Type</h3>
        <div className="grid grid-cols-2 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() =>
                setCategory(selectedCategory === cat.value ? 0 : cat.value)
              }
              className={`py-2 px-4 rounded-[16px] text-[20px] font-medium border transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-[#14B8A6] text-white border-[#14B8A6]'
                  : 'border-[#14B8A6] text-[#14B8A6] hover:bg-teal-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Widget */}
      <div
        className="rounded-[16px]"
        style={{ boxShadow: '4px 4px 8px 0 rgba(0,0,0,0.25)' }}
      >
        <CalendarWidget />
      </div>
    </div>
  );

  return (
    <div className="bg-[#F3F4F6] py-10 px-6 lg:px-10">
      <div className="max-w-[95%] mx-auto">

        {/* لایه‌بندی: روی xl سه ستونه، زیرش تک ستون */}
        <div className="xl:flex xl:gap-8 xl:items-start">

          {/* ستون چپ: کارت‌های ایونت */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 xl:mb-0">
            {isLoading ? (
              <div className="col-span-2 flex items-center justify-center py-20">
                <span className="text-[#14B8A6] text-[20px]">Loading events...</span>
              </div>
            ) : events.length === 0 ? (
              <div className="col-span-2 flex items-center justify-center py-20">
                <span className="text-gray-400 text-[20px]">No events found.</span>
              </div>
            ) : (
              events.map((event) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  date={formatDate(event.startDate)}
                  location={event.venue + (event.city ? `, ${event.city}` : '')}
                  description={event.description}
                  hostName="Host"
                  imageUrl={`https://placehold.co/600x400/e2e8f0/64748b?text=${encodeURIComponent(event.category)}`}
                />
              ))
            )}
          </div>

          {/* ستون راست روی xl: sticky */}
          <div className="hidden xl:block w-[320px] shrink-0 sticky top-8 self-start">
            {sidebar}
          </div>

        </div>

        {/* ستون راست زیر xl: زیر ایونت‌ها نشون داده می‌شه */}
        <div className="xl:hidden mt-8">
          {sidebar}
        </div>

      </div>
    </div>
  );
});

export default HomePage;