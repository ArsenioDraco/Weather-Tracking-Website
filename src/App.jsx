import React, {useState, useEffect, useRef} from "react";

function getApiKey() {
  try {
    if (typeof process !== 'undefined' && process.env?.REACT_APP_OPENWEATHERMAP_KEY) {
      return process.env.REACT_APP_OPENWEATHERMAP_KEY;
    }
  } catch {}
  try {
    if (typeof window !== 'undefined' && window.__OPENWEATHERMAP_KEY__) return window.__OPENWEATHERMAP_KEY__;
  } catch {}
  try {
    if (typeof window !== 'undefined' && window.location?.search) {
      const p = new URLSearchParams(window.location.search);
      const q = p.get('apiKey') || p.get('apikey');
      if (q) return q;
    }
  } catch {}
  return '';
}
const API_KEY = getApiKey();
const BASE_WEATHER = "https://api.openweathermap.org/data/2.5/weather";
const BASE_FORECAST = "https://api.openweathermap.org/data/2.5/forecast";

function aggregateDailyForecast(list) {
  const days = {};
  list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const key = date.toISOString().slice(0,10);
    if (!days[key]) days[key] = [];
    days[key].push(item);
  });
return Object.keys(days).slice(0,5).map(key => {
    const arr = days[key];
    let chosen = arr.reduce((best, cur) => {
      const curHour = new Date(cur.dt * 1000).getHours();
      const bestHour = new Date(best.dt * 1000).getHours();
      return Math.abs(curHour - 12) < Math.abs(bestHour - 12) ? cur : best;
    }, arr[0]);
    return {
      date: key,
      temp: chosen.main.temp,
      icon: chosen.weather[0].icon,
      desc: chosen.weather[0].description
    };
  });
}

const sampleCurrent = {
  name: "Berlin",
  sys: {country: "DE"},
  main: {temp: 19.5, humidity: 72},
  weather: [{icon: "04d", description: "broken clouds"}],
  wind: {speed: 3.4}
};
const sampleForecast = {
  list: [
    {dt: Math.floor(Date.now()/1000), main: {temp: 19}, weather:[{icon:"04d",description:"cloudy"}]},
    {dt: Math.floor(Date.now()/1000) + 86400, main: {temp: 21}, weather:[{icon:"01d",description:"clear sky"}]},
    {dt: Math.floor(Date.now()/1000) + 86400*2, main: {temp: 18}, weather:[{icon:"10d",description:"light rain"}]}
  ]
};

export default function App() {
  const [query, setQuery] = useState("");
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tracked, setTracked] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wt_tracked")) || []; } catch {return []}
  });
  const inputRef = useRef(null);
useEffect(() => {
    localStorage.setItem("wt_tracked", JSON.stringify(tracked));
  }, [tracked]);

  useEffect(() => {
    if (!API_KEY && !current) {
      setCurrent(sampleCurrent);
      setForecast(aggregateDailyForecast(sampleForecast.list));
    }
  }, []);
async function fetchWeatherByCoords(lat, lon) {
    setError("");
    setLoading(true);
    try {
      if (!API_KEY) throw new Error("No API key configured. Showing sample data.");
      const wc = await fetch(`${BASE_WEATHER}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
      if (!wc.ok) throw new Error();
      const cur = await wc.json();
      const wf = await fetch(`${BASE_FORECAST}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
      if (!wf.ok) throw new Error();
      const f = await wf.json();
      setCurrent(cur);
      setForecast(aggregateDailyForecast(f.list));
    } catch (e) {
      setError(e.message);
      if (!API_KEY) {
        setCurrent(sampleCurrent);
        setForecast(aggregateDailyForecast(sampleForecast.list));
      }
    } finally {
      setLoading(false);
    }
  }
async function fetchWeatherByCity(city) {
    if (!city) return;
    setError("");
    setLoading(true);
    try {
      if (!API_KEY) throw new Error("No API key configured. Showing sample data.");
      const wc = await fetch(`${BASE_WEATHER}?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`);
      if (!wc.ok) throw new Error(`City not found: ${city}`);
      const cur = await wc.json();
      const wf = await fetch(`${BASE_FORECAST}?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`);
 if (!wf.ok) throw new Error();
      const f = await wf.json();
      setCurrent(cur);
      setForecast(aggregateDailyForecast(f.list));
    } catch (e) {
      setError(e.message);
      if (!API_KEY) {
        setCurrent(sampleCurrent);
        setForecast(aggregateDailyForecast(sampleForecast.list));
      }
    } finally {
      setLoading(false);
    }
  }
function handleAddTracked() {
    if (!current) return;
    const id = `${current.name},${current.sys?.country || ""}`;
    if (tracked.find(t => t.id === id)) return;
    const item = {id, name: current.name, country: current.sys?.country};
    setTracked([item, ...tracked]);
  }

  function handleRemoveTracked(id) {
    setTracked(tracked.filter(t => t.id !== id));
  }

  function handleUseTracked(item) {
    fetchWeatherByCity(item.name);
  }
 function handleGeolocate() {
    if (!navigator.geolocation) { setError("Geolocation not supported"); return; }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(pos => {
      fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
    }, err => {
      setLoading(false);
      setError(err.message);
    }, {timeout: 10000});
  }


  function onSubmitSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    fetchWeatherByCity(query.trim());
    setQuery("");
    inputRef.current?.blur();
  }
return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <header className="mb-8">
          <h1 className="text-5xl font-extrabold leading-tight mb-2">WeatherTracker</h1>
          <p className="text-lg text-slate-600">Track current weather and short-term forecasts. Save cities you care about.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <form onSubmit={onSubmitSearch} className="md:col-span-2 bg-white p-4 rounded-2xl shadow-sm">
            <div className="flex gap-3 items-center">
<input
  ref
  value
  onchange
  placeholder
  classname
  aria-label
  



