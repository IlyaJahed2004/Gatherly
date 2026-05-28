// عکس نمونه برای پیش‌فرض کارت
const MOCK_IMAGE = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2000&auto=format&fit=crop";

const EventCard = () => {
    return (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
            {/* بخش بالا: عنوان و وضعیت */}
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800 capitalize">Chinese Festivals</h3>
                <span className="px-3 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded-full">
                    I'm going
                </span>
            </div>

            {/* عکس رویداد */}
            <div className="w-full h-56 rounded-2xl overflow-hidden">
                <img 
                    src={MOCK_IMAGE} 
                    alt="Event thumbnail" 
                    className="w-full h-full object-cover"
                />
            </div>

            {/* جزئیات: تاریخ و مکان */}
            <div className="flex flex-col gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    {/* آیکون تقویم */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-teal-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    <span className="font-medium">15 Mar 2026 9:00 AM</span>
                </div>
                <div className="flex items-center gap-2">
                    {/* آیکون مکان */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-teal-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <span className="truncate">Cascade National Park</span>
                </div>
            </div>

            {/* توضیحات رویداد */}
            <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                Join us as we celebrate the spirit of Chinese culture with vibrant lanterns, dragon dances, and festive traditions.
            </p>

            {/* بخش پایین: میزبان و دکمه */}
            <div className="flex justify-between items-center pt-3 mt-1 border-t border-gray-100">
                <div className="flex items-center gap-3">
                    <img 
                        src="https://randomuser.me/api/portraits/men/32.jpg" 
                        alt="Host" 
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400">hosted by</span>
                        <span className="text-sm font-bold text-gray-800">Joo Min</span>
                    </div>
                </div>
                <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-2.5 rounded-full font-medium transition-colors shadow-md text-sm">
                    View
                </button>
            </div>
        </div>
    );
};

export default EventCard;