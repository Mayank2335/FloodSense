import { District, Alert } from '@/types/flood';

export const mockDistricts: District[] = [
  {
    id: 'dist-001',
    name: 'Wayanad',
    region: 'Kerala',
    riskLevel: 'danger',
    rainfall24h: 245,
    rainfallForecast: 180,
    riverLevel: 94,
    lastUpdated: new Date(),
    population: 817000,
    coordinates: { lat: 11.6854, lng: 76.1320 },
    alertMessage: 'Red Alert: Kabini river overflowing. Landslide warning in hilly terrains.',
    weather: { temp: 23, condition: 'Stormy', humidity: 92, windSpeed: 35 },
    history: [
      { time: '06:00', level: 85 },
      { time: '08:00', level: 89 },
      { time: '10:00', level: 92 },
      { time: '12:00', level: 94 }
    ]
  },
  {
    id: 'dist-002',
    name: 'Patna',
    region: 'Bihar',
    riskLevel: 'warning',
    rainfall24h: 85,
    rainfallForecast: 65,
    riverLevel: 82,
    lastUpdated: new Date(),
    population: 2500000,
    coordinates: { lat: 25.5941, lng: 85.1376 },
    alertMessage: 'Ganga water level rising steadily. Low-lying ghats submerged.',
    weather: { temp: 29, condition: 'Rainy', humidity: 85, windSpeed: 18 },
    history: [
      { time: '06:00', level: 78 },
      { time: '08:00', level: 80 },
      { time: '10:00', level: 81 },
      { time: '12:00', level: 82 }
    ]
  },
  {
    id: 'dist-003',
    name: 'Dibrugarh',
    region: 'Assam',
    riskLevel: 'danger',
    rainfall24h: 120,
    rainfallForecast: 150,
    riverLevel: 96,
    lastUpdated: new Date(),
    population: 154000,
    coordinates: { lat: 27.4728, lng: 94.9120 },
    alertMessage: 'Brahmaputra flowing above danger mark. Major embankments under stress.',
    weather: { temp: 26, condition: 'Stormy', humidity: 90, windSpeed: 42 },
    history: [
      { time: '06:00', level: 92 },
      { time: '08:00', level: 94 },
      { time: '10:00', level: 95 },
      { time: '12:00', level: 96 }
    ]
  },
  {
    id: 'dist-004',
    name: 'Chennai',
    region: 'Tamil Nadu',
    riskLevel: 'watch',
    rainfall24h: 45,
    rainfallForecast: 110,
    riverLevel: 65,
    lastUpdated: new Date(),
    population: 11000000,
    coordinates: { lat: 13.0827, lng: 80.2707 },
    alertMessage: 'Cyclonic circulation approaching. Heavy rain forecast for next 24h.',
    weather: { temp: 31, condition: 'Cloudy', humidity: 78, windSpeed: 25 },
    history: [
      { time: '06:00', level: 55 },
      { time: '08:00', level: 58 },
      { time: '10:00', level: 62 },
      { time: '12:00', level: 65 }
    ]
  },
  {
    id: 'dist-005',
    name: 'Mumbai Suburban',
    region: 'Maharashtra',
    riskLevel: 'warning',
    rainfall24h: 155,
    rainfallForecast: 140,
    riverLevel: 75,
    lastUpdated: new Date(),
    population: 9350000,
    coordinates: { lat: 19.0760, lng: 72.8777 },
    alertMessage: 'High tide warning. Mithi river level increasing.',
    weather: { temp: 28, condition: 'Rainy', humidity: 88, windSpeed: 30 },
    history: [
      { time: '06:00', level: 60 },
      { time: '08:00', level: 68 },
      { time: '10:00', level: 72 },
      { time: '12:00', level: 75 }
    ]
  },
  {
    id: 'dist-006',
    name: 'Lakeside Township',
    region: 'Northern Zone',
    riskLevel: 'watch',
    rainfall24h: 78,
    rainfallForecast: 110,
    riverLevel: 58,
    lastUpdated: new Date(),
    population: 67000,
    coordinates: { lat: 28.7041, lng: 77.1025 },
    weather: { temp: 27, condition: 'Rainy', humidity: 80, windSpeed: 20 },
    history: [
      { time: '06:00', level: 50 },
      { time: '08:00', level: 53 },
      { time: '10:00', level: 56 },
      { time: '12:00', level: 58 }
    ]
  },
  {
    id: 'dist-007',
    name: 'Forest Hills',
    region: 'Western Zone',
    riskLevel: 'safe',
    rainfall24h: 28,
    rainfallForecast: 35,
    riverLevel: 28,
    lastUpdated: new Date(),
    population: 42000,
    coordinates: { lat: 22.7196, lng: 75.8577 },
    weather: { temp: 30, condition: 'Sunny', humidity: 60, windSpeed: 10 },
    history: [
      { time: '06:00', level: 24 },
      { time: '08:00', level: 25 },
      { time: '10:00', level: 27 },
      { time: '12:00', level: 28 }
    ]
  },
  {
    id: 'dist-008',
    name: 'Delta Region',
    region: 'Eastern Zone',
    riskLevel: 'danger',
    rainfall24h: 220,
    rainfallForecast: 165,
    riverLevel: 95,
    lastUpdated: new Date(),
    population: 178000,
    alertMessage: 'Major flooding in progress. Emergency services deployed.',
    coordinates: { lat: 21.1458, lng: 79.0882 },
    weather: { temp: 25, condition: 'Stormy', humidity: 95, windSpeed: 45 },
    history: [
      { time: '06:00', level: 88 },
      { time: '08:00', level: 91 },
      { time: '10:00', level: 93 },
      { time: '12:00', level: 95 }
    ]
  },
];

export const activeAlerts: Alert[] = [
  {
    id: 'alert-001',
    districtId: 'dist-001',
    districtName: 'Wayanad',
    level: 'danger',
    message: 'RED ALERT: Flash flood warning. Evacuate low-lying areas immediately.',
    issuedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
    isActive: true,
  },
  {
    id: 'alert-002',
    districtId: 'dist-002',
    districtName: 'Patna',
    level: 'warning',
    message: 'ORANGE ALERT: River Ganga crossing danger mark. Prepare for potential evacuation.',
    issuedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
    isActive: true,
  },
  {
    id: 'alert-003',
    districtId: 'dist-003',
    districtName: 'Dibrugarh',
    level: 'danger',
    message: 'CRITICAL: Dyke breach reported. Rescue teams deployed.',
    issuedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 5 * 60 * 60 * 1000),
    isActive: true,
  },
];

export const systemLogs = [
  { id: 1, type: 'info', message: 'IMD API synchronization complete', timestamp: 'Just now' },
  { id: 2, type: 'warning', message: 'Sensor KA-04-B (Kabini) reporting high latency', timestamp: '5m ago' },
  { id: 3, type: 'success', message: 'CWC Forecast model updated v2.4', timestamp: '12m ago' },
  { id: 4, type: 'danger', message: 'River gauge #23 (Brahmaputra) exceeding threshold', timestamp: '30m ago' },
  { id: 5, type: 'info', message: 'NDRF District deployment data refreshed', timestamp: '1h ago' },
];

export const getSummaryStats = () => {
  const stats = {
    total: mockDistricts.length,
    safe: 0,
    watch: 0,
    warning: 0,
    danger: 0,
    totalPopulationAtRisk: 0,
    activeAlerts: activeAlerts.filter(a => a.isActive).length,
  };

  mockDistricts.forEach(district => {
    stats[district.riskLevel]++;
    if (district.riskLevel !== 'safe') {
      stats.totalPopulationAtRisk += district.population;
    }
  });

  return stats;
};
