import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateRangePicker = ({ onDateChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
  const handleDateChange = (date) => {
    setStartDate(date);
    setEndDate(date); // If only one date is selected, set both start and end to the same date
    onDateChange(date, date); // Pass the same date as both values
  };

  return (
    <div>
      <label>Select Date:</label>
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange={false} // Disable range selection
        inline
      />
    </div>
  );
};

export default DateRangePicker;