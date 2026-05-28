import React from 'react';

const CalendarWidget: React.FC = () => {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const selectedDays = [14, 25];

  const emptyStartDays = ['-', '-', '-', '-']; 
  const emptyEndDays = ['-', '-'];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full max-w-[300px]">
      
      {/* هدر تقویم: ماه و فلش‌ها */}
      <div className="flex justify-between items-center mb-6">
        <button className="text-[#F59E0B] hover:opacity-80 transition-opacity">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-[#148846] text-[20px] font-regular">September 2024</span>
        <button className="text-[#F59E0B] hover:opacity-80 transition-opacity">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* روزهای هفته */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={`weekday-${index}`} className="text-gray-400 text-[11px] font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* روزهای ماه */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* روزهای خالی اول ماه */}
        {emptyStartDays.map((_, index) => (
          <div key={`empty-start-${index}`} className="text-gray-300 text-[11px] py-1 flex items-center justify-center">
            -
          </div>
        ))}

        {/* روزهای اصلی */}
        {days.map((day) => {
          const isSelected = selectedDays.includes(day);
          return (
            <div key={day} className="flex justify-center items-center py-1">
              <span 
                className={`w-6 h-6 flex items-center justify-center rounded-full text-[11px] cursor-pointer transition-colors
                  ${isSelected ? 'bg-[#148846] text-white' : 'text-[#1F2937] hover:bg-gray-100'}`}
              >
                {day}
              </span>
            </div>
          );
        })}

        {/* روزهای خالی آخر ماه */}
         {emptyEndDays.map((_, index) => (
          <div key={`empty-end-${index}`} className="text-gray-300 text-[11px] py-1 flex items-center justify-center">
            -
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default CalendarWidget;