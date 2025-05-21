"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const CustomDatePicker = ({ selectedDate, onDateChange }) => {
  // Get the current date
  const today = new Date();

  // Calculate dates for 18 years ago
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );

  // Generate years (only showing 18+ years - from current year - 18 down to 100 years ago)
  const maxYear = eighteenYearsAgo.getFullYear();
  const minYear = maxYear - 82; // Allowing selection up to 100 years old

  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [daysInMonth, setDaysInMonth] = useState(31);
  const [isOpen, setIsOpen] = useState(false);

  // Month names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Function to check if a year is a leap year
  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  // Function to calculate days in a month
  const getDaysInMonth = (month, year) => {
    // Month needs to be 1-12, where 1 is January and 12 is December
    if (month === 2) {
      // February
      return isLeapYear(parseInt(year)) ? 29 : 28;
    } else if ([4, 6, 9, 11].includes(parseInt(month))) {
      // April, June, September, November
      return 30;
    } else {
      // January, March, May, July, August, October, December
      return 31;
    }
  };

  // Effect to update days in month when month or year changes
  useEffect(() => {
    if (selectedMonth !== "") {
      const year =
        selectedYear !== "" ? parseInt(selectedYear) : new Date().getFullYear();
      const month = parseInt(selectedMonth);
      const days = getDaysInMonth(month, year);
      setDaysInMonth(days);

      // If the currently selected day is greater than the last day of the month, reset it
      if (selectedDay !== "" && parseInt(selectedDay) > days) {
        setSelectedDay("1"); // Reset to a valid day
      }
    }
  }, [selectedMonth, selectedYear]);

  // Effect to initialize values if selectedDate is provided
  useEffect(() => {
    if (selectedDate) {
      setSelectedDay(selectedDate.getDate().toString());
      setSelectedMonth((selectedDate.getMonth() + 1).toString());
      setSelectedYear(selectedDate.getFullYear().toString());
    }
  }, [selectedDate]);

  // Function to format the date for display
  const formatDate = () => {
    if (selectedDay && selectedMonth && selectedYear) {
      const monthName = months[parseInt(selectedMonth) - 1];
      return `${monthName} ${selectedDay}, ${selectedYear}`;
    }
    return "Select your date of birth";
  };

  // Handle date selection
  const handleDateSelection = () => {
    if (selectedMonth && selectedYear) {
      // If day isn't selected but month and year are, default to the 1st of the month
      const day = selectedDay || "1";

      const newDate = new Date(
        parseInt(selectedYear),
        parseInt(selectedMonth) - 1,
        parseInt(day)
      );

      onDateChange(newDate);
      setIsOpen(false);
    }
  };

  // Handle month change
  const handleMonthChange = (value) => {
    setSelectedMonth(value);

    // If year is already selected, calculate days for the new month
    if (selectedYear) {
      const days = getDaysInMonth(parseInt(value), parseInt(selectedYear));

      // If currently selected day exceeds days in the new month, reset to a valid day
      if (selectedDay && parseInt(selectedDay) > days) {
        setSelectedDay("1");
      }
    }
  };

  // Handle year change
  const handleYearChange = (value) => {
    setSelectedYear(value);

    // If month is already selected, recalculate days for the new year
    if (selectedMonth) {
      const days = getDaysInMonth(parseInt(selectedMonth), parseInt(value));

      // If currently selected day exceeds days in the month for the new year, reset to a valid day
      if (selectedDay && parseInt(selectedDay) > days) {
        setSelectedDay("1");
      }
    }
  };

  return (
    <div className="relative w-full">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            {selectedDay && selectedMonth && selectedYear ? (
              formatDate()
            ) : (
              <span className="text-gray-400">Select your date of birth</span>
            )}
            <svg
              className="ml-auto h-4 w-4 opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="space-y-4">
            <div className="text-sm font-medium">Date of Birth</div>

            <div className="grid grid-cols-3 gap-2">
              {/* Month Selector */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Month
                </label>
                <Select value={selectedMonth} onValueChange={handleMonthChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month, index) => (
                      <SelectItem
                        key={index + 1}
                        value={(index + 1).toString()}
                      >
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Day Selector */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Day</label>
                <Select
                  value={selectedDay}
                  onValueChange={(value) => setSelectedDay(value)}
                  disabled={!selectedMonth} // Disable day selection until month is selected
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                      (day) => (
                        <SelectItem key={day} value={day.toString()}>
                          {day}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Year Selector */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Year</label>
                <Select value={selectedYear} onValueChange={handleYearChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {Array.from(
                      { length: maxYear - minYear + 1 },
                      (_, i) => maxYear - i
                    ).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              className="w-full bg-blue-500 hover:bg-blue-600"
              onClick={handleDateSelection}
              disabled={!selectedMonth || !selectedYear} // Only require month and year
            >
              Confirm Selection
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

// Rest of the DatePickerDemo component remains unchanged
const DatePickerDemo = () => {
  const [dob, setDob] = useState(null);

  return (
    <div className="flex flex-col h-full">
      {/* Header with wave */}
      <div className="relative bg-blue-500 pt-16 pb-10">
        <div className="text-center text-white text-2xl font-medium mb-2">
          Relief
        </div>
        <div className="text-center text-white text-sm font-medium mb-6">
          Emergency Response and Tracking System
        </div>
      </div>

      {/* Content area */}
      <div className="bg-white flex-1 px-6 pt-6 pb-6">
        {/* Patient Registration button */}
        <Button className="w-full bg-blue-500 hover:bg-blue-600 mb-6">
          Patient Registration
        </Button>

        <div className="space-y-6">
          {/* Phone Number Field */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600 block">Phone Number</label>
            <Input
              type="tel"
              className="w-full"
              placeholder="Enter 10-digit phone number"
            />
          </div>

          {/* Date of Birth Field */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600 block">Date of Birth</label>
            <CustomDatePicker
              selectedDate={dob}
              onDateChange={(date) => {
                setDob(date);
                console.log("Selected Date:", date);
              }}
            />
            <p className="text-xs text-gray-500">
              You must be at least 18 years old
            </p>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600 block">Password</label>
            <Input
              type="password"
              className="w-full"
              placeholder="Enter password (min 8 characters)"
            />
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600 block">
              Confirm Password
            </label>
            <Input
              type="password"
              className="w-full"
              placeholder="Confirm your password"
            />
          </div>

          {/* Register Button */}
          <Button className="w-full bg-blue-500 hover:bg-blue-600">
            Register
          </Button>

          {/* Login Link */}
          <div className="text-center text-sm mt-4">
            Already have an account?{" "}
            <span className="text-blue-500 cursor-pointer">Login</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatePickerDemo;
