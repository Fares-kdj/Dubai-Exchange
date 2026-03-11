import * as React from "react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

export function DatePicker({ date, setDate, className, minDate, maxDate, placeholder }) {
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  
  const [isOpen, setIsOpen] = React.useState(false);

  // Select appropriate locale
  // For Kurdish (ku), date-fns doesn't have an official deep translation easily available in standard package,
  // falling back to English or Arabic based on user preference, we'll use English for numbers/structure but app is RTL/LTR.
  const locale = currentLanguage === 'ar' ? ar : enUS;
  
  // Format string based on language
  const dateStr = date ? format(date, "PPP", { locale }) : "";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal h-11",
            isDark 
              ? "bg-slate-700 border-slate-600 text-white hover:bg-slate-600 focus:border-[#D4AF37]" 
              : "bg-white border-slate-300 text-slate-900 hover:bg-slate-50 focus:border-[#D4AF37]",
            !date && (isDark ? "text-slate-400" : "text-slate-500"),
            className
          )}
        >
          <CalendarIcon className="mr-1 h-4 w-4 opacity-70" />
          {date ? dateStr : <span>{placeholder || "اختر تاريخ"}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-auto p-0", isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")} align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            setDate(selectedDate);
            setIsOpen(false);
          }}
          disabled={(d) => {
            let disabled = false;
            // Never disable old dates completely unless minDate is explicitly enforced
            if (minDate && d < new Date(minDate).setHours(0,0,0,0)) disabled = true;
            if (maxDate && d > new Date(maxDate).setHours(0,0,0,0)) disabled = true;
            return disabled;
          }}
          initialFocus
          locale={locale}
          className={isDark ? "text-white" : "text-slate-900"}
          captionLayout="dropdown-buttons"
          fromYear={1900}
          toYear={new Date().getFullYear() + 10}
        />
      </PopoverContent>
    </Popover>
  );
}
