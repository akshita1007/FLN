import React, { useState } from 'react';
import { Button, DatePicker, Space } from 'antd';
import dayjs from 'dayjs';
import "./DateRangeValue.css"
const { RangePicker } = DatePicker;

const DateRangeValue = () => {

  const [selectedDates, setSelectedDates] = useState([null, null]);

  const handleDateChange = (dates, dateStrings) => {
    setSelectedDates(dates);
    console.log('Selected Dates:', dates);
    console.log('Formatted Dates:', dateStrings);
  };

  const disabledDate = (current) => {
    return current && current > dayjs().endOf('day');
  };

  const handleReset = () => {
    setSelectedDates([null,null]); 
  };

  return (
    <Space direction="vertical" size={2}>
      <RangePicker  value={selectedDates} onChange={handleDateChange} disabledDate={disabledDate} className="custom-range-picker" />
      
    </Space>
  );
}

export default DateRangeValue