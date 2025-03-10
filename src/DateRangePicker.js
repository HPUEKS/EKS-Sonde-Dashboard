import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateRangePicker = ({ onDateChange }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const handleDateChange = (dates) => {
    if (!dates) return; // Prevents crashes if input is null

    let [start, end] = dates;

    if (!start) return; // Prevents breaking if no date is selected
    if (!end) end = start; // If only one date is picked, set both start and end

    setDateRange([start, end]);
    onDateChange(start, end);
  };

  return (
    <div>
      <label>Select Date Range:</label>
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange={true} // Enables drag-to-select for range
        inline
      />
    </div>
  );
};

export default DateRangePicker;
