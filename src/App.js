import React, { useState, useEffect } from 'react';
import { Container, Nav, Card, Dropdown, ButtonGroup } from 'react-bootstrap';
import { database, ref, onValue } from './firebaseConfig';
import SensorChart from './SensorChart';
import DateRangePicker from "./DateRangePicker";
import "react-datepicker/dist/react-datepicker.css";
import { parse, subDays, subWeeks, subMonths, subYears } from 'date-fns';

const App = () => {
  const [sensorData, setSensorData] = useState({});
  const [activeTab, setActiveTab] = useState('temperature');
  const [timeRange, setTimeRange] = useState('Day');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Handle Time Range Selection
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);

    // Reset manual date selection when a time range is chosen
    let newStartDate = null;
    let newEndDate = new Date();

    switch (range) {
      case 'Day':
        newStartDate = subDays(newEndDate, 1);
        break;
      case 'Week':
        newStartDate = subWeeks(newEndDate, 1);
        break;
      case 'Month':
        newStartDate = subMonths(newEndDate, 1);
        break;
      case 'Year':
        newStartDate = subYears(newEndDate, 1);
        break;
      default:
        newStartDate = subDays(newEndDate, 1);
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  // Handle Manual Date Selection
  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    setTimeRange(null); // Disable auto range selection when manually picking dates
  };

  // Fetch Firebase Data
  useEffect(() => {
    const dataRef = ref(database, 'sensor_readings');

    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Raw Firebase Data:", data);

      if (data) {
        try {
          const formattedData = Object.keys(data).reduce((acc, timestamp) => {
            const parsedDate = parse(timestamp, 'yyyy-MM-dd_HH-mm-ss', new Date());

            if (!isNaN(parsedDate)) {
              acc[timestamp] = {
                time: parsedDate,
                ...data[timestamp]
              };
            } else {
              console.error("Invalid timestamp format:", timestamp);
            }

            return acc;
          }, {});

          console.log("Formatted Data for Graphs:", formattedData);
          setSensorData(formattedData);
        } catch (error) {
          console.error("Error Processing Data:", error);
          setSensorData({});
        }
      } else {
        console.warn("No data found in Firebase.");
        setSensorData({});
      }
    }, (error) => {
      console.error("Firebase Read Error:", error);
    });
  }, []);

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Sensor Dashboard</h1>

      {/* Time Range Selection & Date Picker */}
      <div className="d-flex justify-content-center mb-3 gap-3">
        <Dropdown as={ButtonGroup}>
          <Dropdown.Toggle variant="outline-primary">{timeRange || "Custom"}</Dropdown.Toggle>
          <Dropdown.Menu>
            {["Day", "Week", "Month", "Year"].map(range => (
              <Dropdown.Item key={range} onClick={() => handleTimeRangeChange(range)}>
                {range}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        
        {/* Date Picker */}
        <DateRangePicker onDateChange={handleDateChange} />
      </div>

      {/* Sensor Tabs */}
      <Nav variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => {
        console.log("Tab changed to:", selectedKey);
        setActiveTab(selectedKey);
      }} className="justify-content-center mb-4">
        <Nav.Item><Nav.Link eventKey="temperature">Temperature</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="conductivity">Conductivity</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="salinity">Salinity</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="dissolved_solids">Dissolved Solids</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="dissolved_oxygen">Dissolved Oxygen</Nav.Link></Nav.Item>
      </Nav>

      {/* Sensor Chart */}
      <Card className="shadow-sm mt-3">
        <Card.Body>
          <Card.Title>{activeTab.replace('_', ' ').toUpperCase()}</Card.Title>
          <SensorChart 
            title={activeTab.replace('_', ' ')} 
            data={sensorData} 
            dataKey={activeTab} 
            color="#4F46E5" 
            timeRange={timeRange}
            startDate={startDate} 
            endDate={endDate}
          />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default App;
