import React, { useState, useEffect } from 'react';
import { Container, Nav, Card, Dropdown, ButtonGroup } from 'react-bootstrap';
import { database, ref, onValue } from './firebaseConfig';
import SensorChart from './SensorChart';
import DateRangePicker from "./DateRangePicker";
import "react-datepicker/dist/react-datepicker.css";

const App = () => {
  const [sensorData, setSensorData] = useState({});
  const [activeTab, setActiveTab] = useState('temperature');
  const [timeRange, setTimeRange] = useState('Day'); 
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Handle date selection (single or range)
  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end || start); // If no end date, default to start date
  };

  useEffect(() => {
    const dataRef = ref(database, 'sensor_readings');
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSensorData(data);
      }
    });
  }, []);

  const handleSelect = (selectedKey) => {
    setActiveTab(selectedKey);
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Sensor Dashboard</h1>

      {/* Time Range and Date Selection */}
      <div className="d-flex justify-content-center mb-3 gap-3">
        <Dropdown as={ButtonGroup}>
          <Dropdown.Toggle variant="outline-primary">{timeRange}</Dropdown.Toggle>
          <Dropdown.Menu>
            {["Day", "Week", "Month", "Year"].map(range => (
              <Dropdown.Item key={range} onClick={() => setTimeRange(range)}>
                {range}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        
        <Dropdown as={ButtonGroup}>
          <Dropdown.Toggle variant="outline-primary">
            {startDate
              ? `${startDate.toLocaleDateString()}${endDate && startDate !== endDate ? ` - ${endDate.toLocaleDateString()}` : ""}`
              : "Select Date Range"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <DateRangePicker onDateChange={handleDateChange} />
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Sensor Tabs */}
      <Nav variant="tabs" activeKey={activeTab} onSelect={handleSelect} className="justify-content-center mb-4">
        <Nav.Item><Nav.Link eventKey="temperature">Temperature</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="conductivity">Conductivity</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="salinity">Salinity</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="dissolved_solids">Dissolved Solids</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="dissolved_oxygen">Dissolved Oxygen</Nav.Link></Nav.Item>
      </Nav>

      {/* Chart */}
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>{activeTab.replace('_', ' ').toUpperCase()}</Card.Title>
          <SensorChart 
            title={activeTab.replace('_', ' ')} 
            data={sensorData} 
            dataKey={activeTab} 
            timeRange={timeRange}
            startDate={startDate} 
            endDate={endDate} 
            color="#4F46E5" 
          />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default App;
