import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateRangePicker = ({ onDateChange }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const handleDateChange = (dates) => {
    let [start, end] = dates;
    
    if (!end) {
      end = start; // If only one date is selected, use it for both
    }

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
        selectsRange={true} // Enable click-and-drag selection
        inline
      />
    </div>
  );
};

export default DateRangePicker;
