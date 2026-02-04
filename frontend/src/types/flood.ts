export type RiskLevel = 'safe' | 'watch' | 'warning' | 'danger';

export interface District {
  id: string;
  name: string;
  region: string;
  riskLevel: RiskLevel;
  rainfall24h: number; // mm
  rainfallForecast: number; // mm expected in next 24h
  riverLevel: number; // percentage of capacity
  lastUpdated: Date;
  population: number;
  coordinates: { lat: number; lng: number };
  alertMessage?: string;
  weather: {
    temp: number;
    condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Stormy';
    humidity: number;
    windSpeed: number;
  };
  history: { time: string; level: number }[];
}

export interface Alert {
  id: string;
  districtId: string;
  districtName: string;
  level: RiskLevel;
  message: string;
  issuedAt: Date;
  expiresAt: Date;
  isActive: boolean;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  forecast: string;
}

export const RISK_THRESHOLDS = {
  rainfall: {
    safe: 50,
    watch: 100,
    warning: 150,
    danger: 200,
  },
  riverLevel: {
    safe: 40,
    watch: 60,
    warning: 80,
    danger: 90,
  },
} as const;

export const RISK_LABELS: Record<RiskLevel, string> = {
  safe: 'Safe',
  watch: 'Watch',
  warning: 'Warning',
  danger: 'Danger',
};

export const RISK_DESCRIPTIONS: Record<RiskLevel, string> = {
  safe: 'Normal conditions. No flood risk detected.',
  watch: 'Elevated conditions. Monitor updates closely.',
  warning: 'Flood risk elevated. Prepare for possible evacuation.',
  danger: 'Immediate flood danger. Evacuate if instructed.',
};
