"use client";
import { useState } from 'react';
import { FiMapPin, FiSearch, FiSun, FiDroplet, FiWind, FiCloudRain, FiThermometer, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

// A more robust component to parse simple markdown (bold and list items)
const SimpleMarkdownParser = ({ text }) => {
  const lines = text.split('\n');
  const elements = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Handle list items
    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
      const itemContent = line.trim().substring(2);
      const parts = itemContent.split(/(\*\*.*?\*\*)/g); // Split by bold tags
      elements.push(
        <li key={i} className="ml-5 list-disc text-gray-700">
          {parts.map((part, j) =>
            part.startsWith('**') && part.endsWith('**') ? (
              <strong key={j} className="font-semibold text-gray-800">{part.slice(2, -2)}</strong>
            ) : (
              part
            )
          )}
        </li>
      );
      continue;
    }

    // Handle bold-only lines as headings
    if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
      elements.push(
        <h3 key={i} className="font-bold text-lg text-green-900 mt-4 mb-2">{line.trim().slice(2, -2)}</h3>
      );
      continue;
    }
    
    // Handle regular paragraphs
    if (line.trim()) {
       const parts = line.split(/(\*\*.*?\*\*)/g);
       elements.push(
         <p key={i} className="my-1 text-gray-700">
           {parts.map((part, j) =>
             part.startsWith('**') && part.endsWith('**') ? (
               <strong key={j} className="font-semibold text-gray-800">{part.slice(2, -2)}</strong>
             ) : (
               part
             )
           )}
         </p>
       );
    }
  }
  return <div>{elements}</div>;
};


const WeatherPage = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [detectingLocation, setDetectingLocation] = useState(false);

  const detectMyLocation = async () => {
    if (!navigator.geolocation) {
      setError('❌ Geolocation not supported by your browser. Please enter location manually.');
      return;
    }

    setDetectingLocation(true);
    setError('');
    setLocation('📍 Detecting your location...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        console.log('📍 GPS Coordinates:', lat, lon);
        
        try {
          setLocation('🌍 Getting location name...');
          
          // Use OpenWeather Geocoding API to get city name from coordinates
          const openWeatherKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
          const geoResponse = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${openWeatherKey}`
          );
          
          if (!geoResponse.ok) {
            throw new Error('Failed to get location details');
          }
          
          const geoData = await geoResponse.json();
          
          if (geoData && geoData.length > 0) {
            const locationInfo = geoData[0];
            const detectedLocation = `${locationInfo.name}, ${locationInfo.state || locationInfo.country}`;
            setLocation(detectedLocation);
            console.log('✅ Location detected:', detectedLocation);
            
            setDetectingLocation(false);
            
            // Auto-fetch weather after detecting location
            setTimeout(() => {
              fetchWeatherDataForCity(locationInfo.name);
            }, 300);
          } else {
            throw new Error('Location data not available');
          }
        } catch (err) {
          console.error('Location detection error:', err);
          setError(`❌ Failed to detect location: ${err.message}. Please try again or enter manually.`);
          setLocation('');
          setDetectingLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMsg = '❌ Location access denied. ';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMsg += 'Please allow location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg += 'Location information is unavailable. Check your device settings.';
            break;
          case error.TIMEOUT:
            errorMsg += 'Location request timed out. Please try again.';
            break;
          default:
            errorMsg += 'An unknown error occurred.';
        }
        
        setError(errorMsg);
        setLocation('');
        setDetectingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  const fetchWeatherDataForCity = async (cityName) => {
    if (!cityName || cityName.trim() === '') {
      setError('Please enter a valid location');
      return;
    }

    console.log('🔍 Searching weather for:', cityName);
    
    setLoading(true);
    setError('');
    setWeatherData(null); // Clear old data first

    try {
      const weatherApiKey = process.env.NEXT_PUBLIC_WEATHERAPI_KEY;
      
      if (!weatherApiKey) {
        throw new Error('WeatherAPI key not configured');
      }
      
      const searchQuery = encodeURIComponent(cityName.trim());
      
      // First, search for exact location match using WeatherAPI search
      const searchUrl = `https://api.weatherapi.com/v1/search.json?key=${weatherApiKey}&q=${searchQuery}`;
      console.log('🔎 Searching locations...');
      
      const searchResponse = await fetch(searchUrl);
      if (!searchResponse.ok) {
        throw new Error('Failed to search locations');
      }
      
      const searchResults = await searchResponse.json();
      console.log('📍 Found locations:', searchResults);
      
      if (!searchResults || searchResults.length === 0) {
        throw new Error(`No location found for "${cityName}". Please check spelling.`);
      }
      
      // Find best match with intelligent matching
      const searchLower = cityName.toLowerCase().trim();
      const searchWords = searchLower.split(/[\s,]+/).filter(w => w.length > 0); // Split by space or comma
      
      console.log('🔍 Search query:', searchLower);
      console.log('🔍 Search words:', searchWords);
      console.log('📋 All available locations:');
      searchResults.forEach((loc, idx) => {
        console.log(`  ${idx + 1}. ${loc.name}, ${loc.region}, ${loc.country}`);
      });
      
      let bestMatch = null;
      
      // ONLY apply strict matching if user provided region/state (2+ words)
      if (searchWords.length >= 2) {
        const cityWord = searchWords[0];
        const regionWords = searchWords.slice(1);
        
        console.log('🎯 Multi-word search detected. City:', cityWord, '| Region keywords:', regionWords);
        
        // Filter exact city name matches
        const exactCityMatches = searchResults.filter(loc => 
          loc.name.toLowerCase() === cityWord
        );
        
        console.log(`   Found ${exactCityMatches.length} locations with exact city name "${cityWord}"`);
        
        if (exactCityMatches.length > 0) {
          // Try to match region
          bestMatch = exactCityMatches.find(loc => {
            const locRegion = loc.region.toLowerCase();
            const locCountry = loc.country.toLowerCase();
            
            const hasMatch = regionWords.some(word => {
              return locRegion.includes(word) || word.includes(locRegion) || 
                     locCountry.includes(word) || word.includes(locCountry);
            });
            
            if (hasMatch) {
              console.log(`   ✓ Region match: ${loc.name}, ${loc.region}`);
            }
            return hasMatch;
          });
          
          // If region match found, use it; otherwise use first exact city match
          if (bestMatch) {
            console.log('✅ Matched with region:', bestMatch.name, bestMatch.region);
          } else {
            bestMatch = exactCityMatches[0];
            console.log('⚠️ No region match, using first exact city match:', bestMatch.name, bestMatch.region);
          }
        }
      }
      
      // If no match yet (single word search OR no exact match), use first result
      if (!bestMatch) {
        bestMatch = searchResults[0];
        console.log('✅ Using first result from API:', bestMatch.name, bestMatch.region, bestMatch.country);
      }
      
      console.log('✅ FINAL MATCH:', bestMatch.name, bestMatch.region, bestMatch.country);
      
      // Now fetch weather for the exact location using lat/lon
      const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${bestMatch.lat},${bestMatch.lon}&days=7&aqi=no`;
      
      console.log('📡 Fetching weather data...');
      const response = await fetch(forecastUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const data = await response.json();
      console.log('✅ Weather data received for:', data.location.name, data.location.region);
      
      const dailyForecast = data.forecast.forecastday.map(day => ({
        day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
        temp: Math.round(day.day.avgtemp_c),
        humidity: day.day.avghumidity,
        rainfall: day.day.totalprecip_mm || 0,
        wind: day.day.maxwind_kph,
        description: day.day.condition.text,
        icon: `https:${day.day.condition.icon}`
      }));

      console.log('🤖 Fetching AI recommendations...');
      const geminiRecommendation = await fetchGeminiRecommendations(
        `${data.location.name}, ${data.location.region}, ${data.location.country}`, 
        dailyForecast
      );

      const newWeatherData = {
        city: data.location.name,
        country: data.location.country,
        region: data.location.region,
        lat: data.location.lat,
        lon: data.location.lon,
        forecast: dailyForecast,
        recommendations: geminiRecommendation,
        current: {
          temp: Math.round(data.current.temp_c),
          feelsLike: Math.round(data.current.feelslike_c),
          humidity: data.current.humidity,
          wind: data.current.wind_kph,
          condition: data.current.condition.text,
          icon: `https:${data.current.condition.icon}`
        }
      };
      
      console.log('💾 Setting weather data:', newWeatherData.city);
      setWeatherData(newWeatherData);
      
    } catch (err) {
      console.error('❌ Weather fetch error:', err);
      setError(err.message || 'Failed to fetch weather data');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchGeminiRecommendations = async (location, forecast) => {
    try {
      const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(startDate.getMonth() + 3);
      const dateRange = `${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`;
      
      const prompt = `
You are an expert agronomist and AI advisor for Indian farmers.
Based on the weather forecast for ${location} from ${dateRange}, provide a crop growing plan for the next 3 months.

For each month, list:
- Recommended crops (based on weather and seasonality)
- Key actions (land prep, sowing, irrigation, fertilization, pest/disease management, harvesting)
- Any important local advice for ${location}

Requirements:
- Limit your answer to 200-250 words.
- Format your answer using markdown: use double asterisks (**) for headings and bold text, bullet points for lists.
- Always cite your sources (public datasets, government portals, etc.) and explain your reasoning for reliability.
- If possible, respond in the user's local language if specified.

Weather data: ${JSON.stringify(forecast)}
`;

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': geminiApiKey
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      const result = await response.json();
      if (result.candidates && result.candidates.length > 0) {
        return result.candidates[0].content.parts[0].text;
      }
      throw new Error("Failed to get recommendation from AI.");
    } catch (err) {
      console.error("Error fetching Gemini recommendations:", err);
      return "Could not load AI recommendations at this time.";
    }
  };

  const fetchWeatherData = async () => {
    const trimmedLocation = location.trim();
    if (!trimmedLocation) {
      setError('Please enter a location.');
      return;
    }
    console.log('🔎 Manual search for:', trimmedLocation);
    await fetchWeatherDataForCity(trimmedLocation);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeatherData();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-50 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="text-3xl font-bold text-green-700">AgriConnect</Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-green-700 transition-colors font-medium">Home</Link>
              <Link href="/weather" className="text-green-700 border-b-2 border-green-700 font-semibold">Weather</Link>
              <Link href="/loan" className="text-gray-600 hover:text-green-700 transition-colors font-medium">Loan</Link>
              <Link href="/contact" className="text-gray-600 hover:text-green-700 transition-colors font-medium">Contact</Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Search Section */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Weather & Crop Advisory</h1>
          <p className="text-gray-600 mb-6">Get real-time weather forecasts and AI-powered farming recommendations.</p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Enter city name (e.g., Durg, Mumbai, Delhi)..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
              <p className="text-xs text-gray-500 mt-1 ml-12">
                💡 Tip: Use full city name for accurate results. Try "Durg, Chhattisgarh" instead of just "Durg"
              </p>
            </div>
            <button
              type="button"
              onClick={detectMyLocation}
              disabled={detectingLocation || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:bg-blue-400"
            >
              {detectingLocation ? 'Detecting...' : <><FiMapPin /><span>Use My Location</span></>}
            </button>
            <button
              type="submit"
              disabled={loading || detectingLocation}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:bg-green-400"
            >
              {loading ? 'Loading...' : <><FiSearch /><span>Get Forecast</span></>}
            </button>
          </form>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </section>

        {/* Weather Display Section */}
        {weatherData ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Forecast */}
            <div className="lg:col-span-1 space-y-6">
              {/* Current Weather Card */}
              {weatherData.current && (
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold">{weatherData.city}</h2>
                      <p className="text-blue-100">{weatherData.region}, {weatherData.country}</p>
                      <p className="text-xs text-blue-200 mt-1">📍 {weatherData.lat.toFixed(4)}°N, {weatherData.lon.toFixed(4)}°E</p>
                    </div>
                    <img src={weatherData.current.icon} alt={weatherData.current.condition} className="w-16 h-16" />
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-bold">{weatherData.current.temp}°</span>
                    <span className="text-xl">C</span>
                  </div>
                  <p className="text-blue-100 mb-4 capitalize">{weatherData.current.condition}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FiThermometer className="w-4 h-4" />
                      <span>Feels like {weatherData.current.feelsLike}°C</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiDroplet className="w-4 h-4" />
                      <span>Humidity {weatherData.current.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiWind className="w-4 h-4" />
                      <span>Wind {weatherData.current.wind} km/h</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Interactive Map */}
              {weatherData && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <FiMapPin className="text-green-600" />
                    Location Map
                  </h3>
                  <div className="rounded-lg overflow-hidden border-2 border-gray-200">
                    <iframe
                      width="100%"
                      height="300"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight="0"
                      marginWidth="0"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${weatherData.lon-0.1},${weatherData.lat-0.1},${weatherData.lon+0.1},${weatherData.lat+0.1}&layer=mapnik&marker=${weatherData.lat},${weatherData.lon}`}
                      style={{ border: 0 }}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <a 
                      href={`https://www.google.com/maps?q=${weatherData.lat},${weatherData.lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
                    >
                      <FiArrowRight />
                      Open in Google Maps
                    </a>
                    <span className="text-gray-500">
                      Zoom: 14x
                    </span>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">7-Day Forecast</h2>
                <div className="space-y-4">
                  {weatherData.forecast.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img src={day.icon} alt={day.description} className="w-10 h-10" />
                        <div>
                          <p className="font-bold text-gray-800">{day.day}</p>
                          <p className="text-sm text-gray-500 capitalize">{day.description}</p>
                        </div>
                      </div>
                      <p className="font-bold text-lg text-gray-800">{day.temp}°C</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Recommendations */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-green-800 mb-4">AI-Powered Growing Recommendations</h2>
                <div className="p-4 bg-green-50/50 rounded-lg border-l-4 border-green-500">
                   <SimpleMarkdownParser text={weatherData.recommendations} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <FiSun className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-xl font-semibold text-gray-800">Your Weather Insights Await</h3>
            <p className="mt-2 text-gray-500">Enter a location above to get started.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default WeatherPage;