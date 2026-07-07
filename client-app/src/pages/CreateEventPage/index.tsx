import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { MapPin, Calendar, Image as ImageIcon, Pencil, Trash2 } from 'lucide-react';
import agent from '../../api/agent';
import { getApiErrorMessage } from '../../utils/apiError';
import LocationPickerMap from '../../components/LocationPickerMap';

// ─── Types ───────────────────────────────────────────────────────────────────
interface CreateEventForm {
  title: string;
  description: string;
  startDate: string;
  startTime: string; // 24-hour "HH:MM" — single source of truth, AM/PM is derived for display only
  endDate: string;
  endTime: string; // 24-hour "HH:MM"
  category: string;
  venue: string;
  city: string;
  latitude: number;
  longitude: number;
}

interface DatePickerState {
  open: boolean;
  field: 'start' | 'end' | null;
  viewYear: number;
  viewMonth: number; // 0-based
}

const CATEGORIES = ['Sports', 'Science', 'Leisure', 'Other'];

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const HOURS = Array.from({ length: 12 }, (_, i) => String(i === 0 ? 12 : i));
const MINUTES = ['00','05','10','15','20','25','30','35','40','45','50','55'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
// timeStr is always 24-hour "HH:MM" — no AM/PM conversion needed here.
function buildISO(dateStr: string, timeStr: string): string {
  if (!dateStr || !timeStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hStr, mStr] = timeStr.split(':');
  return new Date(Date.UTC(year, month - 1, day, parseInt(hStr, 10), parseInt(mStr, 10))).toISOString();
}

// Derives AM/PM from a 24-hour "HH:MM" string — period is a view of the time, not separate state.
function getPeriod(timeStr: string): 'AM' | 'PM' {
  return parseInt(timeStr.split(':')[0], 10) >= 12 ? 'PM' : 'AM';
}

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  return `${day} ${MONTHS[month - 1].slice(0, 3)} ${year}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  // 0=Sun, shift so Mon=0
  return (new Date(year, month, 1).getDay() + 6) % 7;
}

// Defined at module scope (not inside the component) so it keeps a stable identity across
// renders — otherwise React remounts its children (including any <input>) on every keystroke,
// which drops focus and makes typing look broken.
const FieldBox = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-0">
    <div
      className={`relative rounded-[12px] border ${
        error ? 'border-red-400' : 'border-[#078C80]'
      } bg-white`}
    >
      <span className="absolute -top-[11px] left-4 bg-white px-1 text-[14px] font-medium text-[#374151]">
        {label}
      </span>
      {children}
    </div>
    {error && <p className="mt-1 ml-2 text-[12px] text-red-500">{error}</p>}
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────
const CreateEventPage = observer(() => {
  const navigate = useNavigate();

  const [form, setForm] = useState<CreateEventForm>({
    title: '',
    description: '',
    startDate: '',
    startTime: '00:00',
    endDate: '',
    endTime: '00:00',
    category: '',
    venue: '',
    city: '',
    latitude: 0,
    longitude: 0,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateEventForm | 'submit', string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Date picker ──
  const today = new Date();
  const [picker, setPicker] = useState<DatePickerState>({
    open: false,
    field: null,
    viewYear: today.getFullYear(),
    viewMonth: today.getMonth(),
  });
  const pickerRef = useRef<HTMLDivElement>(null);

  // ── Category dropdown ──
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  // ── Time scroll refs ──
  const startHourRef = useRef<HTMLDivElement>(null);
  const startMinRef  = useRef<HTMLDivElement>(null);
  const endHourRef   = useRef<HTMLDivElement>(null);
  const endMinRef    = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPicker(p => ({ ...p, open: false }));
      }
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Handlers ──
  const set = (key: keyof CreateEventForm, value: string | number) =>
    setForm(f => ({ ...f, [key]: value }));

  const openPicker = (field: 'start' | 'end') => {
    setPicker(p => ({ ...p, open: true, field }));
  };

  const selectDay = (day: number) => {
    const m = String(picker.viewMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const dateStr = `${picker.viewYear}-${m}-${d}`;
    if (picker.field === 'start') set('startDate', dateStr);
    else set('endDate', dateStr);
    // Don't close – user may still pick time
  };

  const prevMonth = () =>
    setPicker(p => {
      if (p.viewMonth === 0) return { ...p, viewMonth: 11, viewYear: p.viewYear - 1 };
      return { ...p, viewMonth: p.viewMonth - 1 };
    });

  const nextMonth = () =>
    setPicker(p => {
      if (p.viewMonth === 11) return { ...p, viewMonth: 0, viewYear: p.viewYear + 1 };
      return { ...p, viewMonth: p.viewMonth + 1 };
    });

  const isSelectedDay = (day: number) => {
    const m = String(picker.viewMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const dateStr = `${picker.viewYear}-${m}-${d}`;
    return picker.field === 'start' ? form.startDate === dateStr : form.endDate === dateStr;
  };

  // Scroll to selected hour / minute on open
  useEffect(() => {
    if (!picker.open) return;
    const timeStr = picker.field === 'start' ? form.startTime : form.endTime;
    const [hStr, mStr] = timeStr.split(':');
    const h = parseInt(hStr, 10);
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const hIdx = HOURS.indexOf(String(displayH));
    const mIdx = MINUTES.indexOf(mStr);

    const hourEl   = picker.field === 'start' ? startHourRef.current : endHourRef.current;
    const minEl    = picker.field === 'start' ? startMinRef.current  : endMinRef.current;
    if (hourEl && hIdx >= 0) hourEl.scrollTop = hIdx * 36;
    if (minEl  && mIdx >= 0) minEl.scrollTop  = mIdx * 36;
  }, [picker.open, picker.field]);

  const handleHourClick = (h: string) => {
    const timeKey = picker.field === 'start' ? 'startTime' : 'endTime';
    const curTime = picker.field === 'start' ? form.startTime : form.endTime;
    const period = getPeriod(curTime);
    let hour = parseInt(h, 10);
    if (period === 'AM' && hour === 12) hour = 0;
    if (period === 'PM' && hour !== 12) hour += 12;
    const curMin = curTime.split(':')[1];
    set(timeKey, `${String(hour).padStart(2, '0')}:${curMin}`);
  };

  const handleMinClick = (m: string) => {
    const timeKey = picker.field === 'start' ? 'startTime' : 'endTime';
    const curHour = (picker.field === 'start' ? form.startTime : form.endTime).split(':')[0];
    set(timeKey, `${curHour}:${m}`);
  };

  const handlePeriodClick = (period: 'AM' | 'PM') => {
    const timeKey = picker.field === 'start' ? 'startTime' : 'endTime';
    const curTime = picker.field === 'start' ? form.startTime : form.endTime;
    const displayHour = getDisplayHour(curTime);
    let hour = displayHour;
    if (period === 'AM' && hour === 12) hour = 0;
    if (period === 'PM' && hour !== 12) hour += 12;
    const curMin = curTime.split(':')[1];
    set(timeKey, `${String(hour).padStart(2, '0')}:${curMin}`);
  };

  const getDisplayHour = (timeStr: string) => {
    const h = parseInt(timeStr.split(':')[0], 10);
    return h === 0 ? 12 : h > 12 ? h - 12 : h;
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.title.trim()) e.title = 'Title is required';
    else if (form.title.length > 100) e.title = 'Title must not exceed 100 characters';
    if (!form.description.trim()) e.description = 'Description is required';
    else if (form.description.length > 2000) e.description = 'Description must not exceed 2000 characters';
    if (!form.startDate) e.startDate = 'Start date is required';
    if (!form.endDate) e.endDate = 'End date is required';
    if (!form.category) e.category = 'Category is required';
    if (!form.venue.trim()) e.venue = 'Venue is required';
    if (!form.city.trim()) e.city = 'City is required';

    if (form.startDate && form.endDate) {
      const start = buildISO(form.startDate, form.startTime);
      const end   = buildISO(form.endDate,   form.endTime);
      if (new Date(start) >= new Date(end)) {
        e.endDate = 'End date/time must be after start';
      }
      if (new Date(start) <= new Date()) {
        e.startDate = 'Start date must be in the future';
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const payload = {
        title:       form.title,
        description: form.description,
        startDate:   buildISO(form.startDate, form.startTime),
        endDate:     buildISO(form.endDate,   form.endTime),
        category:    CATEGORIES.indexOf(form.category) + 1,
        city:        form.city,
        venue:       form.venue,
        latitude:    form.latitude || 0,
        longitude:   form.longitude || 0,
        isCancelled: false,
        image:       image ?? undefined,
      };
      const id = await agent.Events.create(payload);
      navigate(`/events/${id}`);
    } catch (err: unknown) {
      setErrors({ submit: getApiErrorMessage(err, 'Failed to create event. Please try again.') });
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Current selected hour/min for display ──
  const activeTime    = picker.field === 'start' ? form.startTime     : form.endTime;
  const activePeriod  = getPeriod(activeTime);
  const activeDispH   = getDisplayHour(activeTime);
  const activeMin     = activeTime.split(':')[1];

  // ── Days grid ──
  const daysCount  = getDaysInMonth(picker.viewYear, picker.viewMonth);
  const firstDay   = getFirstDayOfMonth(picker.viewYear, picker.viewMonth);
  const days: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysCount }, (_, i) => i + 1),
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-10 px-6 lg:px-16">
      <div className="max-w-[1100px] mx-auto">
        {/* Title */}
        <h1 className="text-[32px] font-semibold text-[#078C80] mb-8">Create Event</h1>

        {/* Submit error */}
        {errors.submit && (
          <p className="mb-4 text-red-500 text-[14px] text-center">{errors.submit}</p>
        )}

        <div className="flex flex-col gap-6">
          {/* Title / Description + Cover Photo */}
          <div className="flex flex-col md:flex-row gap-6 items-stretch">
            <div className="flex-1 flex flex-col gap-6">
              <FieldBox label="Title" error={errors.title}>
                <input
                  type="text"
                  placeholder="Enter a title for your activity"
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  dir="auto"
                  className="w-full px-4 py-3 rounded-[12px] text-[15px] text-[#374151] bg-transparent outline-none placeholder-gray-400"
                />
              </FieldBox>

              <FieldBox label="Descripion" error={errors.description}>
                <textarea
                  placeholder="Describe your activity , what it's about , and what people can expect"
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  rows={3}
                  dir="auto"
                  className="w-full px-4 py-3 rounded-[12px] text-[15px] text-[#374151] bg-transparent outline-none placeholder-gray-400 resize-none"
                />
              </FieldBox>
            </div>

            <div className="w-full md:w-[340px] flex-shrink-0">
              <div className="relative w-full h-full min-h-[160px] rounded-[16px] overflow-hidden bg-gray-100">
                {imagePreview ? (
                  <img src={imagePreview} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon size={40} />
                  </div>
                )}
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title={imagePreview ? 'Change photo' : 'Upload photo'}
                    className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-[#078C80] hover:bg-teal-50 transition-colors"
                  >
                    <Pencil size={16} />
                  </button>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      title="Remove photo"
                      className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Date row */}
          <div ref={pickerRef} className="relative flex flex-col sm:flex-row gap-4">
            {/* Start Date */}
            <div className="flex-1">
              <FieldBox label="Start of Date" error={errors.startDate}>
                <button
                  type="button"
                  onClick={() => openPicker('start')}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-[12px] text-[15px] bg-transparent outline-none"
                >
                  <span className={form.startDate ? 'text-[#374151]' : 'text-gray-400'}>
                    {form.startDate ? formatDisplayDate(form.startDate) : 'Select a date'}
                  </span>
                  <Calendar size={18} className="text-gray-400" />
                </button>
              </FieldBox>
            </div>

            {/* End Date */}
            <div className="flex-1">
              <FieldBox label="End of Date" error={errors.endDate}>
                <button
                  type="button"
                  onClick={() => openPicker('end')}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-[12px] text-[15px] bg-transparent outline-none"
                >
                  <span className={form.endDate ? 'text-[#374151]' : 'text-gray-400'}>
                    {form.endDate ? formatDisplayDate(form.endDate) : 'Select a date'}
                  </span>
                  <Calendar size={18} className="text-gray-400" />
                </button>
              </FieldBox>
            </div>

            {/* ── Date/Time Picker Dropdown ── */}
            {picker.open && (
              <div
                className="absolute left-0 right-0 sm:right-auto top-[calc(100%+8px)] z-[1100] flex bg-white rounded-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-gray-100 overflow-x-auto max-w-full"
                style={{ width: 'min(460px, 90vw)' }}
              >
                {/* Calendar */}
                <div className="p-4 flex flex-col gap-3" style={{ minWidth: 300 }}>
                  {/* Month nav */}
                  <div className="flex items-center justify-between px-1">
                    <button
                      type="button"
                      onClick={prevMonth}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <svg className="w-4 h-4 text-[#078C80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="bg-[#078C80] text-white text-[14px] font-medium px-4 py-1 rounded-full">
                      {MONTHS[picker.viewMonth].slice(0, 3)}
                    </span>
                    <button
                      type="button"
                      onClick={nextMonth}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <svg className="w-4 h-4 text-[#078C80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Week headers */}
                  <div className="grid grid-cols-7 gap-0">
                    {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                      <div key={d} className="text-center text-[12px] text-gray-400 font-medium py-1">
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Days */}
                  <div className="grid grid-cols-7 gap-0">
                    {days.map((day, idx) => (
                      <div key={idx} className="flex items-center justify-center">
                        {day ? (
                          <button
                            type="button"
                            onClick={() => selectDay(day)}
                            className={`w-8 h-8 rounded-full text-[13px] transition-colors ${
                              isSelectedDay(day)
                                ? 'bg-[#078C80] text-white font-semibold'
                                : 'text-[#374151] hover:bg-teal-50'
                            }`}
                          >
                            {day}
                          </button>
                        ) : (
                          <div className="w-8 h-8" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="w-px bg-gray-100" />

                {/* Time picker */}
                <div className="flex" style={{ minWidth: 160 }}>
                  {/* Hours */}
                  <div
                    ref={picker.field === 'start' ? startHourRef : endHourRef}
                    className="flex flex-col overflow-y-auto"
                    style={{ width: 48, maxHeight: 252, scrollbarWidth: 'none' }}
                  >
                    {HOURS.map(h => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => handleHourClick(h)}
                        className={`flex-shrink-0 h-9 text-[13px] text-center transition-colors ${
                          activeDispH === parseInt(h, 10)
                            ? 'text-[#078C80] font-semibold bg-teal-50'
                            : 'text-[#374151] hover:bg-gray-50'
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>

                  {/* Minutes */}
                  <div
                    ref={picker.field === 'start' ? startMinRef : endMinRef}
                    className="flex flex-col overflow-y-auto border-l border-gray-100"
                    style={{ width: 48, maxHeight: 252, scrollbarWidth: 'none' }}
                  >
                    {MINUTES.map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => handleMinClick(m)}
                        className={`flex-shrink-0 h-9 text-[13px] text-center transition-colors ${
                          activeMin === m
                            ? 'text-[#078C80] font-semibold bg-teal-50'
                            : 'text-[#374151] hover:bg-gray-50'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

                  {/* AM/PM */}
                  <div className="flex flex-col border-l border-gray-100" style={{ width: 48 }}>
                    {(['AM', 'PM'] as const).map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handlePeriodClick(p)}
                        className={`flex-shrink-0 h-9 text-[13px] font-medium transition-colors ${
                          activePeriod === p
                            ? 'text-[#078C80] bg-teal-50'
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Category */}
          <div ref={catRef} className="relative">
            <FieldBox label="Category" error={errors.category}>
              <button
                type="button"
                onClick={() => setCatOpen(o => !o)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-[12px] text-[15px] bg-transparent outline-none"
              >
                <span className={form.category ? 'text-[#374151]' : 'text-gray-400'}>
                  {form.category || 'Select a category'}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${catOpen ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </FieldBox>

            {catOpen && (
              <div className="absolute right-0 top-[calc(100%+4px)] z-[1100] bg-white rounded-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden"
                style={{ minWidth: 200 }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => { set('category', cat); setCatOpen(false); }}
                    className={`w-full text-left px-5 py-3 text-[14px] transition-colors ${
                      form.category === cat
                        ? 'text-[#078C80] bg-teal-50 font-medium'
                        : 'text-[#374151] hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Location */}
          <FieldBox label="Location" error={errors.venue || errors.city}>
            <div className="flex items-center px-4 py-3 gap-2">
              <MapPin size={16} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Enter a venue / location"
                value={form.venue}
                onChange={e => set('venue', e.target.value)}
                dir="auto"
                className="flex-1 text-[15px] text-[#374151] bg-transparent outline-none placeholder-gray-400"
              />
              {form.venue && (
                <span className="text-gray-300 mx-1">|</span>
              )}
              <input
                type="text"
                placeholder="City"
                value={form.city}
                onChange={e => set('city', e.target.value)}
                dir="auto"
                className="w-[140px] text-[15px] text-[#374151] bg-transparent outline-none placeholder-gray-400"
              />
            </div>
          </FieldBox>

          {/* Map: click to set the event's coordinates */}
          <div className="flex flex-col gap-2">
            <p className="text-[14px] text-gray-500">
              Click on the map to set the exact location
              {(form.latitude !== 0 || form.longitude !== 0) &&
                ` (${form.latitude.toFixed(5)}, ${form.longitude.toFixed(5)})`}
            </p>
            <LocationPickerMap
              latitude={form.latitude}
              longitude={form.longitude}
              onChange={(lat, lng) => {
                set('latitude', lat);
                set('longitude', lng);
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3 rounded-full text-[16px] font-medium border border-gray-300 text-[#374151] hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 rounded-full text-[16px] font-medium bg-[#078C80] text-white hover:bg-[#067068] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CreateEventPage;