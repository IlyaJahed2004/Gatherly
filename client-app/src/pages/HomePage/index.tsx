const HomePage = () => {
  return (
      <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* بخش سمت چپ: لیست رویدادها */}
              <div className="lg:col-span-2 space-y-6">
                   {/* اینا فعلاً نمایشی هستن تا بعداً کامپوننت اصلی رو بسازیم */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm h-64 flex items-center justify-center border border-gray-100">
                      <span className="text-gray-400">محل قرارگیری لیست رویدادها (کارت‌ها)</span>
                  </div>
                   <div className="bg-white p-6 rounded-2xl shadow-sm h-64 flex items-center justify-center border border-gray-100">
                      <span className="text-gray-400">محل قرارگیری لیست رویدادها (کارت‌ها)</span>
                  </div>
              </div>

              {/* بخش سمت راست: سایدبار (فیلترها و تقویم) */}
              <div className="space-y-6">
                   {/* Placeholder برای فیلترها */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm h-48 flex items-center justify-center border border-gray-100">
                       <span className="text-gray-400">فیلتر رویدادها (Event Type)</span>
                  </div>
                  {/* Placeholder برای تقویم */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm h-64 flex items-center justify-center border border-gray-100">
                       <span className="text-gray-400">تقویم (Calendar)</span>
                  </div>
              </div>
          </div>
      </div>
  );
};

export default HomePage;
