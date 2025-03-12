import React, { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DateRangePicker.css";

const DateRangePicker = ({ onDateChange }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [selectingEnd, setSelectingEnd] = useState(false); // Track if selecting start or end date

  const handleChange = (dates) => {
    let [start, end] = dates;

    if (start && !end) {
      // If a second date isn't selected yet, track that the user is selecting the end date next
      setSelectingEnd(true);
    } else if (start && end) {
      setSelectingEnd(false); // User has selected both dates, reset tracking
    }

    setDateRange([start, end]);
    onDateChange(start, end || start);
  };

  const handleReset = () => {
    setDateRange([null, null]);
    setSelectingEnd(false);
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
