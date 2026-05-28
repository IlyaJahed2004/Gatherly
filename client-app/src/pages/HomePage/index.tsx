const MOCK_IMAGE_1 = "";
const MOCK_IMAGE_2 = "";

interface EventCardProps {
    title: string;
    tag: "I'm going" | "I'm hosting" | "Open";
    image: string;
    date: string;
    location: string;
    description: string;
    hostName: string;
    hostAvatar: string;
}

const EventCard = ({ title, tag, image, date, location, description, hostName, hostAvatar }: EventCardProps) => {
    const tagStyles = {
        "I'm going": "text-emerald-700 bg-emerald-50 border border-emerald-200",
        "I'm hosting": "text-blue-700 bg-blue-50 border border-blue-200",
        "Open": "text-gray-600 bg-gray-50 border border-gray-200"
    };

    return (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4 transition-all hover:shadow-md">
            {/* بخش بالا: عنوان و وضعیت */}
            <div className="flex justify-between items-start gap-4">
                <h3 className="text-xl font-bold text-gray-800 capitalize leading-tight">{title}</h3>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${tagStyles[tag]}`}>
                    {tag}
                </span>
            </div>

            {/* عکس رویداد */}
            <div className="w-full h-52 rounded-2xl overflow-hidden relative bg-gray-100">
                <img 
                    src={image} 
                    alt={title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
            </div>

            {/* جزئیات: تاریخ و مکان */}
            <div className="flex flex-col gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    {/* آیکون تقویم */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-teal-600 shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    <span className="font-medium">{date}</span>
                </div>
                <div className="flex items-center gap-2">
                    {/* آیکون مکان */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-teal-600 shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <span className="truncate font-medium">{location}</span>
                </div>
            </div>

            {/* توضیحات رویداد */}
            <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                {description}
            </p>

            {/* بخش پایین: میزبان و دکمه */}
            <div className="flex justify-between items-center pt-3 mt-1 border-t border-gray-100">
                <div className="flex items-center gap-3">
                    <img 
                        src={hostAvatar} 
                        alt={hostName} 
                        className="w-10 h-10 rounded-full object-cover border border-teal-50"
                    />
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400">hosted by</span>
                        <span className="text-sm font-bold text-gray-800">{hostName}</span>
                    </div>
                </div>
                <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-2.5 rounded-full font-semibold transition-all hover:shadow shadow-sm text-sm">
                    View
                </button>
            </div>
        </div>
    );
};

const FiltersPanel = () => {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-5">
            <div>
                <h3 className="text-lg font-bold text-gray-800">Event Type</h3>
                <p className="text-xs text-gray-400">Filter events by categories or status</p>
            </div>
            
            {/* دسته‌بندی‌ها */}
            <div className="flex flex-col gap-2.5">
                <button className="flex items-center justify-between p-3 rounded-2xl bg-teal-50 text-teal-800 font-semibold text-sm transition-colors">
                    <span className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                        All Events
                    </span>
                    <span className="bg-teal-100 px-2.5 py-0.5 rounded-lg text-xs">12</span>
                </button>

                <button className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors text-left">
                    <span className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-400"></span>
                        Sports
                    </span>
                    <span className="bg-gray-100 px-2.5 py-0.5 rounded-lg text-xs text-gray-500">4</span>
                </button>

                <button className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors text-left">
                    <span className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                        Science
                    </span>
                    <span className="bg-gray-100 px-2.5 py-0.5 rounded-lg text-xs text-gray-500">2</span>
                </button>

                <button className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors text-left">
                    <span className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                        Leisure
                    </span>
                    <span className="bg-gray-100 px-2.5 py-0.5 rounded-lg text-xs text-gray-500">5</span>
                </button>
            </div>

            <hr className="border-gray-100" />

            {/* فیلترهای شخصی کاربر */}
            <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-700 font-medium">
                    <input type="checkbox" className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500" />
                    <span>Events I'm going to</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-700 font-medium">
                    <input type="checkbox" className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500" />
                    <span>Events I'm hosting</span>
                </label>
            </div>
        </div>
    );
};

const CalendarPanel = () => {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <span className="font-bold text-gray-800 text-base">March 2026</span>
                <div className="flex gap-1">
                    <button className="p-1 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <button className="p-1 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* نام روزهای هفته */}
            <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-bold text-gray-400">
                {weekDays.map(wd => (
                    <div key={wd}>{wd}</div>
                ))}
            </div>

            {/* گرید شماره روزها */}
            <div className="grid grid-cols-7 gap-y-1.5 text-center text-sm font-medium text-gray-700">
                {/* ایجاد آفست فرضی برای شروع ماه از روز یکشنبه */}
                {Array.from({ length: 0 }).map((_, i) => (
                    <div key={`empty-${i}`}></div>
                ))}
                
                {days.map(day => {
                    const isSelected = day === 15;
                    return (
                        <button 
                            key={day} 
                            className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center transition-all ${
                                isSelected 
                                ? 'bg-teal-600 text-white font-bold shadow-sm shadow-teal-200' 
                                : 'hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const HomePage = () => {
    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* بخش سمت چپ: لیست رویدادها */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <EventCard 
                        title="Chinese Festivals"
                        tag="I'm going"
                        image={MOCK_IMAGE_1}
                        date="15 Mar 2026 9:00 AM"
                        location="Cascade National Park"
                        description="Join us as we celebrate the spirit of Chinese culture with vibrant lanterns, dragon dances, and festive traditions."
                        hostName="Joo Min"
                        hostAvatar="https://randomuser.me/api/portraits/men/32.jpg"
                    />
                    <EventCard 
                        title="Tech Startup Networking"
                        tag="Open"
                        image={MOCK_IMAGE_2}
                        date="22 Mar 2026 6:30 PM"
                        location="Silicon Boulevard Cafe"
                        description="Connect with passionate entrepreneurs, developers, and investors. Pitch your ideas or find your next co-founder!"
                        hostName="Sarah Connor"
                        hostAvatar="https://randomuser.me/api/portraits/women/44.jpg"
                    />
                </div>

                {/* بخش سمت راست: سایدبار (فیلترها و تقویم) */}
                <div className="flex flex-col gap-6">
                    <FiltersPanel />
                    <CalendarPanel />
                </div>
            </div>
        </div>
    );
};

export default HomePage;