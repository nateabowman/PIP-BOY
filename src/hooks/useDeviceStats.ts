import { useState, useEffect } from 'react';

export interface DeviceStats {
  batteryLevel: number;
  batteryCharging: boolean;
  networkType: string;
  online: boolean;
}

export const useDeviceStats = () => {
  const [stats, setStats] = useState<DeviceStats>({
    batteryLevel: 1,
    batteryCharging: false,
    networkType: 'unknown',
    online: navigator.onLine
  });

  useEffect(() => {
    const updateBattery = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          setStats(prev => ({
            ...prev,
            batteryLevel: battery.level,
            batteryCharging: battery.charging
          }));

          const handleBatteryChange = () => {
            setStats(prev => ({
              ...prev,
              batteryLevel: battery.level,
              batteryCharging: battery.charging
            }));
          };

          battery.addEventListener('chargingchange', handleBatteryChange);
          battery.addEventListener('levelchange', handleBatteryChange);

          return () => {
            battery.removeEventListener('chargingchange', handleBatteryChange);
            battery.removeEventListener('levelchange', handleBatteryChange);
          };
        } catch (error) {
          console.error('Battery API not available:', error);
        }
      }
    };

    const updateNetwork = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        setStats(prev => ({
          ...prev,
          networkType: connection.effectiveType || 'unknown',
          online: navigator.onLine
        }));

        const handleNetworkChange = () => {
          setStats(prev => ({
            ...prev,
            networkType: connection.effectiveType || 'unknown',
            online: navigator.onLine
          }));
        };

        connection.addEventListener('change', handleNetworkChange);
        window.addEventListener('online', handleNetworkChange);
        window.addEventListener('offline', handleNetworkChange);

        return () => {
          connection.removeEventListener('change', handleNetworkChange);
          window.removeEventListener('online', handleNetworkChange);
          window.removeEventListener('offline', handleNetworkChange);
        };
      }
    };

    updateBattery();
    const networkCleanup = updateNetwork();

    return () => {
      if (networkCleanup) networkCleanup();
    };
  }, []);

  return stats;
};

