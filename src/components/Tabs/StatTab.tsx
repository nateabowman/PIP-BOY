import React from 'react';
import { useStats } from '../../hooks/useStats';
import { useLocation } from '../../hooks/useLocation';
import { useWeather } from '../../hooks/useWeather';
import { useDeviceStats } from '../../hooks/useDeviceStats';
import StatDisplay from '../StatDisplay';
import { formatCoordinates, formatBattery } from '../../utils/formatters';

const StatTab: React.FC = () => {
  const stats = useStats();
  const { location } = useLocation();
  const { weather } = useWeather(location?.lat, location?.lng);
  const deviceStats = useDeviceStats();

  return (
    <div className="tab-content fade-in">
      <StatDisplay label="Time" value={stats.time} />
      <StatDisplay label="Date" value={stats.date} />
      
      {location && (
        <>
          <StatDisplay 
            label="Location" 
            value={location.address || formatCoordinates(location.lat, location.lng)} 
          />
          <StatDisplay 
            label="Coordinates" 
            value={formatCoordinates(location.lat, location.lng)} 
          />
        </>
      )}

      <StatDisplay label="Steps" value={stats.steps} animate />
      <StatDisplay label="Calories" value={stats.calories} unit="cal" animate />

      {weather && (
        <>
          <StatDisplay label="Temperature" value={weather.temperature} unit="°F" />
          <StatDisplay label="Condition" value={weather.condition} />
          <StatDisplay label="Humidity" value={weather.humidity} unit="%" />
          <StatDisplay label="Wind Speed" value={weather.windSpeed} unit="mph" />
        </>
      )}

      <StatDisplay 
        label="Battery" 
        value={formatBattery(deviceStats.batteryLevel)} 
      />
      <StatDisplay 
        label="Network" 
        value={deviceStats.online ? deviceStats.networkType.toUpperCase() : 'OFFLINE'} 
      />
    </div>
  );
};

export default StatTab;

