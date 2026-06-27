import React, { useState, useEffect } from 'react';
import { Container, Nav, Card, Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import { database, ref, onValue } from './firebaseConfig';
import SensorChart from './SensorChart';
import DateRangePicker from './DateRangePicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parse, subDays, subWeeks, subMonths, subYears } from 'date-fns';

const TIMESTAMP_FORMAT = 'yyyy-MM-dd_HH-mm-ss';

const App = () => {
  const [sensorData, setSensorData] = useState({});
  const [activeTab, setActiveTab] = useState('temperature');
  const [timeRange, setTimeRange] = useState('Day');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const getDefaultStartDate = (range, end) => {
    switch (range) {
      case 'Day':
        return subDays(end, 1);
      case 'Week':
        return subWeeks(end, 1);
      case 'Month':
        return subMonths(end, 1);
      case 'Year':
        return subYears(end, 1);
      default:
        return subDays(end, 1);
    }
  };

  const handleTimeRangeChange = (range) => {
    const newEndDate = new Date();
    const newStartDate = getDefaultStartDate(range, newEndDate);
    setTimeRange(range);
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    setTimeRange(null);
  };

  const getFilteredRows = () => {
    const now = new Date();
    const finalEndDate = endDate || now;
    const finalStartDate = startDate || getDefaultStartDate(timeRange || 'Day', finalEndDate);

    return Object.keys(sensorData)
      .map((firebaseKey) => {
        const entry = sensorData[firebaseKey];
        const time = new Date(entry.time);

        if (Number.isNaN(time.getTime())) return null;
        if (time < finalStartDate || time > finalEndDate) return null;

        const waterLevelCm = Number(entry.water_level ?? '');
        const waterLevelM = Number.isFinite(waterLevelCm) ? waterLevelCm / 100 : '';

        return {
          firebase_key: firebaseKey,
          timestamp: entry.timestamp || firebaseKey,
          datetime_local: time.toLocaleString(),
          unix_timestamp: entry.unix_timestamp ?? '',
          temperature_C: entry.temperature ?? '',
          dissolved_oxygen_mg_L: entry.dissolved_oxygen ?? '',
          conductivity_uS_cm: entry.conductivity ?? '',
          dissolved_solids_mg_L: entry.dissolved_solids ?? '',
          salinity_ppt: entry.salinity ?? '',
          water_level_cm: entry.water_level ?? '',
          water_level_m: waterLevelM,
          water_level_status: entry.water_level_status ?? '',
          source: entry.source ?? '',
        };
      })
      .filter(Boolean)
      .sort((a, b) => String(a.timestamp).localeCompare(String(b.timestamp)));
  };

  const csvEscape = (value) => {
    if (value === null || value === undefined) return '';
    const text = String(value);
    if (text.includes(',') || text.includes('"') || text.includes('\n')) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  };

  const downloadCsv = () => {
    const rows = getFilteredRows();

    if (rows.length === 0) {
      alert('No data available for the selected range.');
      return;
    }

    const columns = [
      'timestamp',
      'datetime_local',
      'unix_timestamp',
      'temperature_C',
      'dissolved_oxygen_mg_L',
      'conductivity_uS_cm',
      'dissolved_solids_mg_L',
      'salinity_ppt',
      'water_level_cm',
      'water_level_m',
      'water_level_status',
      'source',
      'firebase_key',
    ];

    const csv = [
      columns.join(','),
      ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `sonde_dashboard_data_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const dataRef = ref(database, 'sensor_readings');

    onValue(
      dataRef,
      (snapshot) => {
        const data = snapshot.val();

        if (!data) {
          setSensorData({});
          return;
        }

        const formattedData = Object.keys(data).reduce((acc, firebaseKey) => {
          const parsedDate = parse(firebaseKey, TIMESTAMP_FORMAT, new Date());

          if (!Number.isNaN(parsedDate.getTime())) {
            acc[firebaseKey] = {
              time: parsedDate,
              ...data[firebaseKey],
            };
          }

          return acc;
        }, {});

        setSensorData(formattedData);
      },
      (error) => {
        console.error('Firebase read error:', error);
        setSensorData({});
      }
    );
  }, []);

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Sensor Dashboard</h1>

      <div className="d-flex justify-content-center mb-3 gap-3 flex-wrap">
        <Dropdown as={ButtonGroup}>
          <Dropdown.Toggle variant="outline-primary">{timeRange || 'Custom'}</Dropdown.Toggle>
          <Dropdown.Menu>
            {['Day', 'Week', 'Month', 'Year'].map((range) => (
              <Dropdown.Item key={range} onClick={() => handleTimeRangeChange(range)}>
                {range}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <DateRangePicker onDateChange={handleDateChange} />

        <Button variant="success" onClick={downloadCsv}>
          Download CSV
        </Button>
      </div>

      <Nav
        variant="tabs"
        activeKey={activeTab}
        onSelect={(selectedKey) => setActiveTab(selectedKey)}
        className="justify-content-center mb-4"
      >
        <Nav.Item><Nav.Link eventKey="temperature">Temperature</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="conductivity">Conductivity</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="salinity">Salinity</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="dissolved_solids">Dissolved Solids</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="dissolved_oxygen">Dissolved Oxygen</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="water_level">Water Level</Nav.Link></Nav.Item>
      </Nav>

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
