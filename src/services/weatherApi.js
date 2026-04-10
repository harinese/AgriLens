const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function getWeatherForecast(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,uv_index_max,relative_humidity_2m_mean',
    current: 'temperature_2m,relative_humidity_2m,weathercode',
    forecast_days: '7',
    timezone: 'auto'
  });

  try {
    const response = await fetch(`${BASE_URL}?${params}`);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Weather fetch error:', error);
    throw error;
  }
}

export function getWeatherDescription(code) {
  const descriptions = {
    0: { text: 'Clear sky', icon: '☀️' },
    1: { text: 'Mainly clear', icon: '🌤️' },
    2: { text: 'Partly cloudy', icon: '⛅' },
    3: { text: 'Overcast', icon: '☁️' },
    45: { text: 'Foggy', icon: '🌫️' },
    48: { text: 'Depositing rime fog', icon: '🌫️' },
    51: { text: 'Light drizzle', icon: '🌦️' },
    53: { text: 'Moderate drizzle', icon: '🌦️' },
    55: { text: 'Dense drizzle', icon: '🌧️' },
    61: { text: 'Slight rain', icon: '🌧️' },
    63: { text: 'Moderate rain', icon: '🌧️' },
    65: { text: 'Heavy rain', icon: '🌧️' },
    71: { text: 'Slight snow', icon: '🌨️' },
    73: { text: 'Moderate snow', icon: '🌨️' },
    75: { text: 'Heavy snow', icon: '❄️' },
    80: { text: 'Slight rain showers', icon: '🌦️' },
    81: { text: 'Moderate rain showers', icon: '🌧️' },
    82: { text: 'Violent rain showers', icon: '⛈️' },
    95: { text: 'Thunderstorm', icon: '⛈️' },
    96: { text: 'Thunderstorm with hail', icon: '⛈️' },
    99: { text: 'Thunderstorm with heavy hail', icon: '⛈️' },
  };
  return descriptions[code] || { text: 'Unknown', icon: '🌡️' };
}

export function getCurrentSeason(latitude) {
  const month = new Date().getMonth() + 1;
  const isSouthern = latitude < 0;
  
  if (isSouthern) {
    if (month >= 3 && month <= 5) return 'Autumn';
    if (month >= 6 && month <= 8) return 'Winter';
    if (month >= 9 && month <= 11) return 'Spring';
    return 'Summer';
  } else {
    if (month >= 3 && month <= 5) return 'Spring';
    if (month >= 6 && month <= 8) return 'Summer';
    if (month >= 9 && month <= 11) return 'Autumn';
    return 'Winter';
  }
}

export function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}
