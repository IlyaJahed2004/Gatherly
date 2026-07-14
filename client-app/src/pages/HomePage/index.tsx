import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import EventCard from '../../components/EventCard';
import CalendarWidget from '../../components/CalendarWidget';
import { useStore } from '../../stores/rootStore';

const CATEGORIES = [
  { label: 'Sports',  value: 1 },
  { label: 'Science', value: 2 },
  { label: 'Leisure', value: 3 },
  { label: 'Other',   value: 4 },
];

const AUTH_CATEGORIES = [
  { label: "I'm going",  value: 6 },
  { label: "I'm hosting", value: 5 },
];

const HomePage = observer(() => {
  const { eventStore, authStore } = useStore();
  const { events, isLoading, selectedCategory, setCategory, loadEvents, currentPage, totalPages, setPage, totalCount } = eventStore;
  const categories = authStore.isLoggedIn ? [...AUTH_CATEGORIES, ...CATEGORIES] : CATEGORIES;

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });

  return (
    <div className="bg-[#F3F4F6] py-6 md:py-10 px-4 sm:px-6 lg:px-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* ستون چپ: ایونت‌ها */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {isLoading ? (
            <div className="sm:col-span-2 flex items-center justify-center py-20">
              <span className="text-[#14B8A6] text-[20px]">Loading events...</span>
            </div>
          ) : events.length === 0 ? (
            <div className="sm:col-span-2 flex items-center justify-center py-20">
              <span className="text-gray-400 text-[20px]">No events found.</span>
            </div>
          ) : (
            events.map((event) => {
              const host = event.attendees.find((a) => a.id === event.hostId);
              const otherAttendees = event.attendees.filter((a) => a.id !== event.hostId);
              return (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  date={formatDate(event.startDate)}
                  location={event.venue + (event.city ? `, ${event.city}` : '')}
                  description={event.description}
                  hostId={event.hostId}
                  hostName={event.hostDisplayName}
                  hostAvatarUrl={host?.imageUrl ?? undefined}
                  imageUrl={event.imageUrl ?? `https://placehold.co/600x400/e2e8f0/64748b?text=${encodeURIComponent(event.category)}`}
                  isCancelled={event.isCancelled}
                  isHost={event.isHost}
                  isGoing={event.isGoing}
                  attendees={otherAttendees}
                />
              );
            })
          )}
          {totalPages > 1 && (
            <div className="sm:col-span-2 flex flex-col items-center mt-6 mb-4 gap-3 w-full">
              <div className="flex justify-between items-center w-full">
                <button
                  onClick={() => setPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-[12px] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white text-[#1F2937] shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:bg-gray-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setPage(page)}
                      className={`w-10 h-10 rounded-[10px] font-medium flex items-center justify-center transition-all ${
                        currentPage === page
                          ? 'bg-[#14B8A6] text-white shadow-[0_2px_8px_rgba(20,184,166,0.3)]'
                          : 'bg-white text-[#1F2937] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-[12px] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-[#14B8A6] text-white shadow-[0_2px_8px_rgba(20,184,166,0.3)] hover:bg-[#0f9788]"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>

              <span className="text-[#1F2937] font-medium text-[13px] mt-1">
                Showing {(currentPage - 1) * 8 + 1}-{Math.min(currentPage * 8, totalCount)} of {totalCount} events
              </span>
            </div>
          )}
        </div>

        {/* ستون راست: sticky sidebar */}
        <div
          className="lg:col-span-1 w-full lg:sticky lg:top-[160px] self-start flex flex-col gap-6 h-auto lg:h-[680px]"
        >

          {/* Event Type Widget */}
          <div
            className="bg-[#FFFFFF] rounded-[16px] p-6 flex-shrink-0"
            style={{ boxShadow: '4px 4px 8px 0 rgba(0,0,0,0.25)' }}
          >
            <h3 className="text-2xl font-medium text-[#1F2937] mb-6">Event Type</h3>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(selectedCategory === cat.value ? 0 : cat.value)}
                  className={`py-2 px-3 rounded-[16px] text-base font-medium border transition-colors ${
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
            className="rounded-[16px] overflow-hidden flex-1 min-h-0"
            style={{ boxShadow: '4px 4px 8px 0 rgba(0,0,0,0.25)' }}
          >
            <CalendarWidget />
          </div>

        </div>
      </div>
    </div>
  );
});

export default HomePage;