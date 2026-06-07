import React from 'react';

const CalendarWidget = () => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const days = [
    27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    25, 26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7
  ];

  return (
    <div className="bg-[#FFFFFF] rounded-3xl p-8 shadow-sm border border-gray-100 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 px-2">
        {/* Arrows: 20px, Regular, Orange */}
        <button className="text-[#F59E0B] font-normal text-[20px]">&lt;</button>
        {/* Month Name: 20px, Regular, Secondary Bg */}
        <div className="bg-[#14B8A6] text-[#FFFFFF] px-6 py-1 rounded-md text-[20px] font-normal">
          May
        </div>
        <button className="text-[#F59E0B] font-normal text-[20px]">&gt;</button>
      </div>

      {/* Weekdays: 11px, Regular */}
      <div className="grid grid-cols-7 gap-2 mb-6 text-center">
        {daysOfWeek.map(day => (
          <div key={day} className="text-[11px] text-[#1F2937] font-normal">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid: 11px, Regular */}
      <div className="grid grid-cols-7 gap-y-6 gap-x-2 text-center flex-grow content-start">
        {days.map((day, idx) => {
          const isCurrentMonth = idx >= 4 && idx <= 34;
          return (
            <div 
              key={idx} 
              className={`text-[11px] font-normal w-6 h-6 mx-auto flex items-center justify-center rounded-full ${
                isCurrentMonth ? 'text-[#1F2937] cursor-pointer hover:bg-teal-50' : 'text-gray-300'
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