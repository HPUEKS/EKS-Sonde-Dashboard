import React, { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DateRangePicker.css";

const DateRangePicker = ({ onDateChange }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const handleChange = (dates) => {
    let [start, end] = dates;

    // ✅ Fix: Ensure single-day selection still works
    if (start && !end) {
      end = new Date(start); // Explicitly set end date to the same day
    }

    setDateRange([start, end]);
    onDateChange(start, end);
  };

  const handleReset = () => {
    setDateRange([null, null]);
    onDateChange(null, null);
  };

  // Custom Input Button
  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <button className="custom-date-picker" onClick={onClick} ref={ref}>
      {value || "Select date range"}
    </button>
  ));

  return (
    <div className="date-picker-wrapper">
      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={handleChange}
        isClearable
        dateFormat="MMM d, yyyy"
        placeholderText="Select date range"
        customInput={<CustomInput />}
        popperPlacement="bottom-start"
      >
        <div className="reset-container">
          <button className="reset-button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </DatePicker>
    </div>
  );
};

export default DateRangePicker;
