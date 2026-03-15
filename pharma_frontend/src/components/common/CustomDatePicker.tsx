import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";

interface CustomDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  size?: "md" | "sm";
}

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

export default function CustomDatePicker({
  value,
  onChange,
  className = "",
  size = "md",
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(
    value ? new Date(value) : new Date(),
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "Sélectionner une date...";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Ajustement pour commencer par Lundi
  };

  const daysInMonth = getDaysInMonth(
    viewDate.getFullYear(),
    viewDate.getMonth(),
  );
  const firstDay = getFirstDayOfMonth(
    viewDate.getFullYear(),
    viewDate.getMonth(),
  );

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleSelectDay = (day: number) => {
    const selectedDate = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth(),
      day,
    );
    // Format YYYY-MM-DD local
    const offset = selectedDate.getTimezoneOffset();
    const localDate = new Date(selectedDate.getTime() - offset * 60 * 1000);
    onChange(localDate.toISOString().split("T")[0]);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center gap-3 bg-white border border-[#f0f0f0] rounded px-4 text-sm font-medium text-gray-700 focus:outline-none focus:border-gray-400 transition-all cursor-pointer hover:border-gray-300 ${
            size === "sm" ? "py-2" : "py-2.5"
          }`}
        >
          <Calendar size={18} className="text-gray-400 shrink-0" />
          <span className={!value ? "text-gray-400" : "text-gray-900"}>
            {formatDateDisplay(value)}
          </span>
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className={`${size === "sm" ? "p-2" : "p-2.5"} text-gray-400 hover:text-red-500 transition-colors`}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white border border-[#f0f0f0] rounded shadow-2xl p-4 w-72 animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-gray-900">
              {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </h4>
            <div className="flex gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-1 hover:bg-gray-100 rounded text-gray-600"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1 hover:bg-gray-100 rounded text-gray-600"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {DAYS.map((day) => (
              <span
                key={day}
                className="text-[10px] font-bold text-gray-400 uppercase"
              >
                {day}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => (
              <div key={idx} className="h-8 flex items-center justify-center">
                {day && (
                  <button
                    onClick={() => handleSelectDay(day)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-xs transition-all ${
                      value &&
                      new Date(value).getDate() === day &&
                      new Date(value).getMonth() === viewDate.getMonth() &&
                      new Date(value).getFullYear() === viewDate.getFullYear()
                        ? "bg-[#00877a] text-white font-bold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between">
            <button
              onClick={() => {
                const today = new Date();
                onChange(today.toISOString().split("T")[0]);
                setIsOpen(false);
              }}
              className="text-xs font-bold text-[#00877a] hover:underline"
            >
              Aujourd'hui
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-gray-400 hover:text-gray-600"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
