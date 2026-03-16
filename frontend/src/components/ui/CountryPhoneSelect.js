import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import ReactCountryFlag from 'react-country-flag';
import { COUNTRIES } from '@/utils/countries';
import { ChevronDown } from "lucide-react";

const CountryPhoneSelect = ({ value, onChange, className, isDark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const dropdownRef = useRef(null);

  // Initial value parsing
  useEffect(() => {
    if (value && typeof value === 'string') {
      const matchingCountry = [...COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length)
        .find(c => value.startsWith(c.dialCode));
      
      if (matchingCountry) {
        setCountry(matchingCountry);
        setPhoneNumber(value.substring(matchingCountry.dialCode.length));
      } else {
        setPhoneNumber(value);
      }
    }
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Close dropdown on click outside for desktop
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handlePhoneChange = (e) => {
    let rawValue = e.target.value.replace(/\D/g, '');
    if (rawValue.startsWith('0')) {
      rawValue = rawValue.substring(1);
    }
    setPhoneNumber(rawValue);
    onChange(`${country.dialCode}${rawValue}`);
  };

  const handleCountrySelect = (c) => {
    setCountry(c);
    onChange(`${c.dialCode}${phoneNumber}`);
    setIsOpen(false);
  };

  return (
    <div className={cn("flex gap-2 relative", className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-[110px] sm:w-[120px] h-12 rounded-lg border-2 flex items-center justify-between px-2 sm:px-3 transition-colors",
            isDark 
              ? "bg-slate-700 border-slate-600 text-white hover:bg-slate-600" 
              : "bg-white border-slate-300 text-slate-900 hover:bg-slate-50 border-slate-200"
          )}
        >
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden pointer-events-none">
            <ReactCountryFlag
              countryCode={country.code}
              svg
              style={{ width: '1.2em', height: '1.2em' }}
            />
            <span className="text-xs sm:text-sm font-bold truncate">{country.dialCode}</span>
          </div>
          <ChevronDown className={cn("w-3.5 h-3.5 opacity-50 transition-transform flex-shrink-0", isOpen && "rotate-180")} />
        </button>

        {/* Backdrop for Mobile */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998] lg:hidden animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* List Container */}
        {isOpen && (
          <div className={cn(
            // Desktop: relative anchor
            "absolute top-[calc(100%+8px)] left-0 w-[240px] max-h-[300px] overflow-y-auto rounded-xl border-2 shadow-2xl z-[1000] py-1",
            // Mobile: Fixed center
            "fixed inset-x-4 top-[15%] bottom-[15%] left-auto right-auto w-auto max-w-sm mx-auto md:absolute md:inset-auto md:top-[calc(100%+8px)] md:left-0 md:w-[240px] md:max-h-[300px]",
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          )}>
            {COUNTRIES.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => handleCountrySelect(c)}
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-4 sm:py-3 text-left transition-colors border-b last:border-0 border-slate-700/20 md:border-0",
                  isDark ? "text-white hover:bg-slate-700" : "text-slate-900 hover:bg-slate-50",
                  country.code === c.code && (isDark ? "bg-slate-700/50" : "bg-blue-50")
                )}
              >
                <ReactCountryFlag
                  countryCode={c.code}
                  svg
                  style={{
                    width: '1.8em',
                    height: '1.8em',
                  }}
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold truncate">{c.name}</span>
                  <span className="text-xs opacity-50 font-medium">{c.dialCode}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <Input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneChange}
        className={cn(
          "h-12 flex-1",
          isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900 font-bold"
        )}
        placeholder={country.example}
        dir="ltr"
      />
    </div>
  );
};

export default CountryPhoneSelect;
