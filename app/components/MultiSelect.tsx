'use client';

import { useState, useRef, useEffect } from 'react';
import { XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface Option {
  id: string;
  label: string;
  description?: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  label: string;
  required?: boolean;
  placeholder?: string;
}

export default function MultiSelect({
  options,
  value,
  onChange,
  label,
  required = false,
  placeholder = 'Select options...'
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOptions = options.filter(option => value.includes(option.id));
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(search.toLowerCase()) ||
    option.description?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionId: string) => {
    const newValue = value.includes(optionId)
      ? value.filter(id => id !== optionId)
      : [...value, optionId];
    onChange(newValue);
  };

  const handleRemove = (optionId: string) => {
    onChange(value.filter(id => id !== optionId));
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Selected Options */}
      <div className="min-h-[38px] w-full rounded-md border border-gray-300 bg-white px-4 py-2 flex flex-wrap gap-2">
        {selectedOptions.length > 0 ? (
          selectedOptions.map(option => (
            <span
              key={option.id}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm bg-indigo-100 text-indigo-700"
            >
              {option.label}
              <button
                type="button"
                onClick={() => handleRemove(option.id)}
                className="hover:text-indigo-900"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </span>
          ))
        ) : (
          <span className="text-gray-500 text-sm">{placeholder}</span>
        )}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="ml-auto flex items-center text-gray-500 hover:text-gray-700"
        >
          <ChevronDownIcon className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-300">
          <div className="p-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <ul className="max-h-60 overflow-auto py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <li
                  key={option.id}
                  className="relative cursor-pointer select-none py-2 px-4 hover:bg-indigo-50"
                  onClick={() => handleSelect(option.id)}
                >
                  <div className="flex items-center">
                    <span className={`block truncate ${value.includes(option.id) ? 'font-medium text-indigo-600' : 'text-gray-900'}`}>
                      {option.label}
                    </span>
                    {option.description && (
                      <span className="ml-2 text-sm text-gray-500">
                        ({option.description})
                      </span>
                    )}
                  </div>
                  {value.includes(option.id) && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </li>
              ))
            ) : (
              <li className="relative cursor-default select-none py-2 px-4 text-gray-500">
                No options found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
} 