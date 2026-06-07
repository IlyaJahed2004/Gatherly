import React from 'react';

const CalendarWidget = () => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  // دیتای تستی برای شبیه‌سازی روزهای تصویر
  const days = [
    27, 28, 29, 30, 1, 2, 3,
    4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17,
    18, 19, 20, 21, 22, 23, 24,
    25, 26, 27, 28, 29, 30, 31,
    1, 2, 3, 4, 5, 6, 7
  ];

  return (
    <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-2">
        <button className="text-yellow-500 hover:text-yellow-600 font-bold text-lg">&lt;</button>
        <div className="bg-[#0D9488] text-white px-5 py-1 rounded-md text-sm font-medium tracking-wide">
          May
        </div>
        <button className="text-yellow-500 hover:text-yellow-600 font-bold text-lg">&gt;</button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-2 mb-5 text-center">
        {daysOfWeek.map(day => (
          <div key={day} className="text-[11px] text-gray-500 font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center text-sm">
        {days.map((day, idx) => {
          const isCurrentMonth = idx >= 4 && idx <= 34;
          return (
            <div 
              key={idx} 
              className={`font-medium w-6 h-6 mx-auto flex items-center justify-center rounded-full transition-colors ${
                isCurrentMonth 
                  ? 'text-gray-600 hover:bg-teal-50 hover:text-[#0D9488] cursor-pointer' 
                  : 'text-gray-300'
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarWidget;